<?php


// Es importante definir los permisos para tramitar solicitudes CORS desde Angular 
header('Access-Control-Allow-Origin: *');       
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");

// **lee los datos JSON del cliente utilizando la función file_get_contents(). 
// **Los datos JSON se decodifican utilizando la función json_decode().
$json   = file_get_contents('php://input');
$params = json_decode($json);

require("../php/conexion.php");

// **Escribe la consulta SQL**
$ins = "INSERT INTO images (
        nombre, 
        tamano, 
        imageurl, 
        creador,
        fecha_creacion) 
    VALUES ('$params->nombre', 
        '$params->tamano', 
        '$params->imageurl', 
        '$params->creador', 
         NOW())";



mysqli_query($conexion, $ins) or die('no inserto');
$mensaje = "se guardo correctamente ";

// **Crea un objeto Result**
class Result
{
    public $resultado;
    public $mensaje;
}

// **Asigna los valores al objeto Result**
$response            = new Result();
$response->resultado = 'OK';
$response->mensaje   = 'datos grabados';

// **Establece el encabezado Content-Type**
header('Content-Type:application/json');

// **Envía el objeto Result codificado como JSON**
echo json_encode($response);

?>