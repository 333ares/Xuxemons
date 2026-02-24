<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function listarInfo($id)
    {
        // Buscamos usuario por id
        $usuario = User::find($id);

        if (!$usuario) {
            // Si no lo encuentra, mostramos error
            return response()->json([
                'message' => 'error',
                'usuario' => 'No existe un usuario con ese ID'
            ], 400);
        }
        // Si se encuentra se muestra su información
        return response()->json([
            'message' => 'success',
            'usuario' => $usuario
        ], 200);
    }
}
