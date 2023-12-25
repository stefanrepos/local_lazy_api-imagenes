<?php

// Es importante definir los permisos para tramitar solicitudes CORS desde Angular 
header('Access-Control-Allow-Origin: *');       
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");

// **Lee los datos JSON**
$json   = file_get_contents('php://input');
// **Obtiene el ID del portafolio que se va a editar**
$id     = $_GET['id'];
// **Decodifica el objeto json para convertir esos datos en un objeto PHP - llamado $params**
$params = json_decode($json);
// **Incluir el contenido de "conexion.php"  con las configuraciones de conexión a la base de datos,**
require("../conexion.php");

$editar = "UPDATE images 
           SET 
           nombre = '$params->nombre', 
           tamano = '$params->tamano', 
           imageurl = '$params->imageurl', 
           creador = '$params->creador', 
           fecha_creacion = '$params->fecha_creacion'
           WHERE id_image=$id";

// **Ejecuta la consulta SQL**
mysqli_query($conexion, $editar) or die("Portafolio no edito");
// **Si la consulta se ejecuta correctamente, crea un objeto `Result` con los campos `resultado` y `mensaje`**
class Result
{
}
;
$response            = new Result();
$response->resultado = 'OK';
$response->mensaje   = 'datos modificados';

// **Envía la respuesta JSON al cliente**
echo json_encode($response);

// **Establece el encabezado `Content-Type` para indicar que la respuesta está en formato JSON**
header('Content-Type:application/json');

?>