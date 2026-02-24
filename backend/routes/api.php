<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/registroUsuario', [AuthController::class, 'registroUsuario']);
Route::post('/loginUsuario',    [AuthController::class, 'loginUsuario']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logoutUsuario', [AuthController::class, 'logoutUsuario']);
});