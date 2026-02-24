<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

Route::post('/registro', [AuthController::class, 'registroUsuario']);
Route::post('/login', [AuthController::class, 'loginUsuario']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logoutUsuario']);
    Route::get('/usuario', [UserController::class, 'listarInfo']);
});