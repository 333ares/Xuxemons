<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MochilaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\XuxemonsController;
use PHPUnit\Metadata\RequiresPhpunitExtension;

Route::post('/registro', [AuthController::class, 'registroUsuario']);
Route::post('/login', [AuthController::class, 'loginUsuario']);

Route::middleware('auth:api')->group(function () {
    // Usuario
    Route::post('/logout', [AuthController::class, 'logoutUsuario']);
    Route::get('/usuario', [UserController::class, 'listarInfo']);
    Route::put('/usuario', [UserController::class, 'actualizarUsuario']);
    Route::delete('/usuario', [UserController::class, 'borrarUsuario']);
    Route::get('usuario/xuxemonsNav', [UserController::class, 'navegadorXuxemons']);

    // Administrador
    Route::post('/agregarXuxemon', [AdminController::class, 'agregarXuxemon']);
    Route::get('listarUsuarios', [AdminController::class, 'listarUsuarios']);

    // Xuxemons
    Route::get('/xuxemons', [XuxemonsController::class, 'listarXuxemons']);
    Route::get('/xuxemons/aire', [XuxemonsController::class, 'listarXuxemonsAire']);
    Route::get('/xuxemons/tierra', [XuxemonsController::class, 'listarXuxemonsTierra']);
    Route::post('/xuxemons/agua', [XuxemonsController::class, 'listarXuxemonsAgua']);
    Route::get('/xuxemons/pequenos', [XuxemonsController::class, 'listarXuxemonsS']);
    Route::get('/xuxemons/medianos', [XuxemonsController::class, 'listarXuxemonsM']);
    Route::post('/xuxemons/grandes', [XuxemonsController::class, 'listarXuxemonsL']);

    // Mochila
    Route::get('/mochila', [MochilaController::class, 'listarObjetos']);
});
