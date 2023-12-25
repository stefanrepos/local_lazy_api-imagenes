import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ImagesService } from "../../servicios/images.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-upload-image",
  templateUrl: "./upload-image.component.html",
  styleUrls: ["./upload-image.component.css"],
})
export class UploadImageComponent implements OnInit {

  // variables: contenedor array 
  imagenBase64: any; // imagen en base 64
  msg = "";   // array mensaje 
  imagen: any; // array imagen cargada 
  galeria: any; // todo el array 
  usuarioLoggeado = "usuarioLoggeado"; // array daos de usuario loggeado 
  datos: any; // array para la carga de imagenes 
  idimages: any;  // identificador de la imagen cargada para edicion 

  // variables: Navegabilidad
  mostrarGalerias: boolean = false;
  mostrarInputEdicion = false;

  // variables: Captura de Datos, FORM
  miImagen = {
    nombre: "", // name
    tamano: "", // size
    imageurl: "", // response.url
    creador: "", // usuario loggeado
    fecha_creacion: "", // now
  };


  constructor(private http: HttpClient, private imagesService: ImagesService) {}
  ngOnInit(): void {
    console.log("consultarImages() running, please pulse Show to get");
  }

  /*  funcionalidades para manipular imagenes  */
  selectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = "Debes seleccionar una imagen";
      return;
    }

    var mimeType = event.target.files[0].type;
    // Imprimir el valor de mimeType en la consola
    console.log("Tipo MIME:", mimeType);

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.imagenBase64 = reader.result;
      console.log("resultado de Reader", reader.result);
      console.log("esta es la URL BASE 64: ", this.imagenBase64);

      // Guardar la imagen y sus atributos  de ella  en la variable imagen
      this.imagen = {
        nombre: event.target.files[0].name,
        tipo: mimeType,
        base64: this.imagenBase64,
        creador: "No se ha especificado el creador",
      };
      // Verificar la variable imagen
      console.log("Este es el objeto imagen con atributos", this.imagen);
      // Imprimir el tipo de la variable imagen
      console.log(typeof this.imagen);
    };
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([int8Array], { type: "image/jpeg" }); // Ajusta el tipo según el formato de tu imagen
  }

  subirArchivo(): void {
    try {
      const formData = new FormData();

      const blob = this.dataURItoBlob(this.imagen.base64);
      formData.append("imagen", blob, this.imagen.nombre);

      console.log("Enviando:", formData); // Muestra el formulario a enviar

      this.http
        .post(
          "http://localhost/lazy-api-imagenes/api-imagenes/src/app/php/upload.php",
          formData
        )
        .subscribe(
          (response: any) => {
            // Obtener la imagen del servidor
            const imagen = response;

            // Actualizar los datos de la imagen
            this.miImagen.imageurl = imagen.url;
            this.miImagen.nombre = imagen.nombreOriginal;
            this.miImagen.tamano = imagen.tamano;
            this.miImagen.fecha_creacion = imagen.fecha_creacion;
            this.miImagen.creador = imagen.creador;
            this.msg = "¡Imagen subida con éxito en la url!";
            console.log(response.url); // Puedes manejar la respuesta del servidor aquí
          },
          (error) => {
            this.msg = "Error al subir la imagen.";
            console.error(error);
          }
        );
    } catch (error) {
      console.error("Error al preparar el formulario:", error);
    }
  }

  /*  funcionalidades para base de datos  */
  ingresar() {
    this.imagesService.insertar(this.miImagen).subscribe((datos: any) => {
      if (datos["resultado"] == "OK") {
        console.log("Datos insertados");
      }
    });
  }
  consultarImages() {
    this.imagesService.consultar().subscribe((result: any) => {
      this.galeria = result;
      this.galeria.forEach((image: typeof Image) => {
        console.log(image);
      });
    });
  }

  consultarListado() {
    this.imagesService.consultar().subscribe((result: any) => {
      this.galeria = result;
      this.galeria.forEach((image: typeof Image) => {
        console.log(image);
      });
    });
  }

  consultarMisImages() {
    this.imagesService.seleccionar().subscribe((result: any) => {
      this.galeria = result;
      this.galeria.forEach((image: typeof Image) => {
        console.log(image);
      });
    });
  }

  /*Alertas antes de eliminar*/
  preguntar(id: any, nombre: any) {
    console.log("entro al registro con id: " + id);
    Swal.fire({
      title: "Estas seguro de eliminar la imagen" + nombre + "?",
      text: "No podras recuperar la imagen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        // llamar la funcio borrar id_usuario
        this.borrarImages(id);
        Swal.fire("Eliminado!", "El registro ha sido borrado.", "success");
      }
    });
  }

  borrarImages(id: any) {
    console.log(id);
    this.imagesService.eliminar(id).subscribe((datos: any) => {
      if (datos["resultado"] == "OK") {
        this.consultarMisImages();
      }
    });
  }

  //**construir el array nuevamente*/
  //**/en esta propiedad es importante llamar todos los datos del modelo para asegurar la carga  */
  cargarDatos(datos: any, id: number) {
    this.miImagen.nombre = datos.nombre; // name
    this.miImagen.tamano = datos.tamano; // size
    this.miImagen.imageurl = datos.imageurl; // response.url
    this.miImagen.creador = datos.creador; // usuario loggeado
    this.miImagen.fecha_creacion = datos.fecha_creacion; // now()
    this.idimages = id; // id_images
    console.log("Datos cargados del ID:", datos);
  }

  editar() {
    this.imagesService
      .edit(this.miImagen, this.idimages)
      .subscribe((datos: any) => {
        if (datos["resultado"] == "OK") {
          console.log("Datos insertados");
          console.log(this.galeria);
          this.consultarImages();
        }
      });
  } /*  funcionalidades para base de datos  */

  /*  funcionalidades para navegabilidad  */
  activarEdicion() {
    this.mostrarInputEdicion = true;
  }

  desactivarEdicion() {
    this.mostrarInputEdicion = false;
  }

  /*  funcionalidades para navegabilidad  */


} /*fin*/
