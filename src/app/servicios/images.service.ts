import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  apiEndpoint = "http://localhost/lazy-api-imagenes/api-imagenes/src/app/php/operation/";
  
  constructor(private http: HttpClient) { }


// **Realiza una solicitud HTTP POST para insertar un dato de imagen**
  insertar(imagen: any) {
  // **Envía los datos de usuario formateados en JSON al punto final insert.php**
  return this.http.post(`${this.apiEndpoint}insertar.php`, JSON.stringify(imagen));

}

  consultar() {
  return this.http.get(`${this.apiEndpoint}consultar.php`); // devuelve la promesa con el resultado
}
  
    // **Realiza una solicitud HTTP GET para eliminar un portafolio con el ID especificado**
  eliminar(id:number) {
  return this.http.get(`${this.apiEndpoint}eliminar.php?id=${id}`);
      
  }
  
  seleccionar(id:number) {
    return this.http.get(`${this.apiEndpoint}seleccionar.php?id=${id}`);    
  }

  edit(datos: any, id: number) {
    // **Envía los datos de datos formateados en JSON al punto final editar.php
      return this.http.post(`${this.apiEndpoint}editar.php?id=${id}`, JSON.stringify(datos));
  }


}