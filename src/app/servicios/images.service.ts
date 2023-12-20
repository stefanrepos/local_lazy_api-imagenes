import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  url = "http://localhost/lazy-api-imagenes/api-imagenes/src/app/php/";
  
  constructor(private http: HttpClient) { }


// **Realiza una solicitud HTTP POST para insertar un dato de imagen**
insertar(imagen: any) {
// **Envía los datos de usuario formateados en JSON al punto final insert.php**
return this.http.post(`${this.url}insertar.php`, JSON.stringify(imagen));

}


  
  

}
