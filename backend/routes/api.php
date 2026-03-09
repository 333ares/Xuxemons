<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
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

    // Administrador
    Route::post('/agregarXuxemon', [AdminController::class, 'agregarXuxemon']);

    // Xuxemons
    Route::get('/xuxemons', [XuxemonsController::class, 'listarXuxemons']);
});