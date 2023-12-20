import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ImagesService } from '../../servicios/images.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {


  base64url: any;  // imagen en base 64 
  msg = "";
  imagen: any;
  archivos: any[""];
  imageUrl?: string;


  // vamos a diseñar el modelo para capturar los datos del form y agregarlos a la tabla 
  miImagen = {
    nombre: "", // name
    tamano: "", // size
    imageurl: "",  // response.url 
    creador: "" , // usuario loggeado
    fecha_creacion: ""
  };

  
  constructor(private http: HttpClient, private imagesService: ImagesService) { }
  ngOnInit(): void { 
    
  }

  
  selectFile(event: any) {
    if(!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'Debes seleccionar una imagen';
      return;
    }
    
    var mimeType = event.target.files[0].type;
     // Imprimir el valor de mimeType en la consola
  console.log('Tipo MIME:', mimeType);
    
    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.base64url = reader.result;
      console.log("resultado de Reader",reader.result);
      console.log("esta es la URL BASE 64: ",this.base64url);

     // Guardar la imagen y sus atributos  de ella  en la variable imagen
      this.imagen = {
        nombre: event.target.files[0].name,
        tipo: mimeType,
        base64: this.base64url,
        creador: "No se ha especificado el creador"
      };
        // Verificar la variable imagen 
      console.log("Este es el objeto imagen con atributos",this.imagen);
      // Imprimir el tipo de la variable imagen
      console.log(typeof(this.imagen));

    };
    
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([int8Array], { type: 'image/jpeg' }); // Ajusta el tipo según el formato de tu imagen
  }
  
  subirArchivo(): void {
    try {
      const formData = new FormData();

      const blob = this.dataURItoBlob(this.imagen.base64);
    formData.append('imagen', blob, this.imagen.nombre);
    
    console.log('Enviando:', formData); // Muestra el formulario a enviar


      this.http.post('http://localhost/lazy-api-imagenes/api-imagenes/src/app/php/upload.php', formData)
    .subscribe(
      (response: any) => {
              
        // Obtener la imagen del servidor
  const imagen = response;

  // Actualizar los datos de la imagen
  this.miImagen.imageurl = imagen.url;
  this.miImagen.nombre = imagen.nombreOriginal;
  this.miImagen.tamano = imagen.tamano;
  this.miImagen.fecha_creacion = imagen.fecha_creacion;
  this.miImagen.creador =  imagen.creador;
  this.msg = '¡Imagen subida con éxito en la url!';
      console.log(response.url); // Puedes manejar la respuesta del servidor aquí
    },
    (error) => {
      this.msg = 'Error al subir la imagen.';
      console.error(error);
    }
  );
    } catch (error) {
      console.error('Error al preparar el formulario:', error);
    }

  }

  ingresar() {

    this.imagesService.insertar(this.miImagen).subscribe((datos: any) => {
      if (datos["resultado"] == "OK") {
        console.log("Datos insertados");
      }
    });

}



  }