<?php
// Permite que cualquier dominio acceda a este recurso
header('Access-Control-Allow-Origin: *');       
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// contains the database connection information//
require("../conexion.php");
//query to select all the users from the `usuarios` table. The results of the query are stored in a variable called `$res`//
$con = "SELECT * 
        FROM images 
        WHERE creador in ('usuario1')
        ORDER BY fecha_creacion";
$res = mysqli_query($conexion, $con) or die('no consulta de images');
//stores each row in an array called `$vec`//
$vec = [];
while ($reg = mysqli_fetch_array($res))
{
    $vec[] = $reg;
}

$cad =json_encode($vec);
// **Establece el encabezado Content-Type para indicar que la respuesta está en formato JSON**
header('Content-Type:application/json');
// **Envía la respuesta JSON**
echo $cad;
?>