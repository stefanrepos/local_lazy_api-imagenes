<?php
// **CORS**
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");

    // **Petición HTTP**
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // **Archivo a subir**
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    // **Nombre aleatorio del archivo y ruta del archivo**
        $fileName = $_FILES['imagen']['name'];
        $uniqueFileName = md5($fileName) . '.' . pathinfo($fileName, PATHINFO_EXTENSION);
    //**destino*/
        $rutaBase = '../uploads/';
        $rutaDestino = $rutaBase . $uniqueFileName;

    // **Mover el archivo**   
        if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {
            $urlImagen = 'http://' . $_SERVER['HTTP_HOST'] . '/lazy-api-imagenes/api-imagenes/src/uploads/' . $uniqueFileName;
        // **Manejo de respuesta **
        $respuesta = [
            'mensaje' => '¡Imagen subida con éxito!',
            'url' => 'http://' . $_SERVER['HTTP_HOST'] . '/lazy-api-imagenes/api-imagenes/src/app/uploads/' . $uniqueFileName,
            'tamano' => $_FILES['imagen']['size'],
            'tipo' => mime_content_type($rutaDestino),
            'nombreOriginal' => $fileName,
            'creador' => 'usuarioLoggeado',
           
        ];
        } else {
        $respuesta = [
                'error' => 'Error al mover el archivo',
            ];
            ini_set('error_log', '../php/error.log');
            error_log('Error al mover el archivo en el lado del servidor.', 0);
        }
    } else {
        $respuesta = [
            'error' => 'Método no permitido, petición HTTP entrante no es de tipo POST.',
        ];
        }
        ini_set('error_log', '../php/error.log');
        error_log('No se recibió un archivo correctamente en el lado del servidor.', 0);
    }
        // **Devolver la respuesta**
        echo json_encode($respuesta);




?>
