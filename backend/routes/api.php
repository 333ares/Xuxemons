<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AmigosController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MochilaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\XuxemonsController;

Route::post('/registro', [AuthController::class, 'registroUsuario']);
Route::post('/login', [AuthController::class, 'loginUsuario']);

Route::middleware('auth:api')->group(function () {
    // Usuario
    Route::post('/logout', [AuthController::class, 'logoutUsuario']);
    Route::get('/usuario', [UserController::class, 'listarInfo']);
    Route::put('/usuario', [UserController::class, 'actualizarUsuario']);
    Route::delete('/usuario', [UserController::class, 'borrarUsuario']);
    Route::get('/xuxemonsNav', [UserController::class, 'navegadorXuxemons']);

    // Administrador
    Route::post('/agregarXuxemon', [AdminController::class, 'agregarXuxemon']);
    Route::post('/agregarObjeto', [AdminController::class, 'agregarObjeto']);
    Route::get('/listarUsuarios', [AdminController::class, 'listarUsuarios']);
    Route::post('/xuxes-diarias', [AdminController::class, 'xuxesDiarias']);
    Route::post('/xuxemon-diario', [AdminController::class, 'xuxemonDiario']);
    Route::post('/reset-config-xuxes', [AdminController::class, 'resetConfigXuxes']);
    Route::post('/reset-config-xuxemons', [AdminController::class, 'resetConfigXuxemons']);
    Route::get('/config-diaria', [AdminController::class, 'getConfigDiaria']);
    Route::post('/config-alimentar', [AdminController::class, 'configAlimentar']);
    Route::get('/config-alimentar', [AdminController::class, 'getConfigAlimentar']);
    Route::put('/config-alimentar', [AdminController::class, 'configAlimentar']);

    // Xuxemons
    Route::get('/xuxemons', [XuxemonsController::class, 'listarXuxemons']);
    Route::get('/xuxemons/tipo', [XuxemonsController::class, 'listarXuxemonsPorTipo']);
    Route::get('/xuxemons/tamano', [XuxemonsController::class, 'listarXuxemonsPorTamano']);
    Route::delete('/xuxemon', [XuxemonsController::class, 'borrarXuxemon']);
    Route::post('/xuxemon/alimentar', [XuxemonsController::class, 'alimentarXuxemon']);
    Route::post('/xuxemon/curar', [XuxemonsController::class, 'curarXuxemon']);

    // Mochila
    Route::get('/mochila', [MochilaController::class, 'listarObjetos']);
    Route::delete('/mochila', [MochilaController::class, 'borrarObjeto']);

    // Amigos
    Route::get('/amigos/buscar', [AmigosController::class, 'buscarUsuario']);
    Route::post('/amigos/solicitud', [AmigosController::class, 'enviarSolicitud']);
    Route::get('/amigos/solicitudes', [AmigosController::class, 'listarSolicitudes']);
    Route::post('/amigos/aceptar', [AmigosController::class, 'aceptarSolicitud']);
    Route::delete('/amigos/rechazar', [AmigosController::class, 'rechazarSolicitud']);
    Route::get('/amigos', [AmigosController::class, 'listarAmigos']);
    Route::delete('/amigos/{id}', [AmigosController::class, 'eliminarAmigo']);
});
