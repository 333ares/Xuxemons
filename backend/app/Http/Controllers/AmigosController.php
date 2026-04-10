<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AmigosController extends Controller
{
    public function buscarUsuario(Request $request)
    {
        // Buscamos el usuario por su public_id
        $usuario = User::where('public_id', $request->public_id)->first();

        // Si no existe, devolvemos error
        if (!$usuario) {
            return response()->json([
                'message' => 'error',
                'errors'  => 'No se ha encontrado ningún jugador con ese ID'
            ], 404);
        }

        // Devolvemos solo los campos publicos (nunca el email ni la contraseña)
        return response()->json([
            'message' => 'success',
            'usuario' => [
                'id'        => $usuario->id,
                'name'      => $usuario->name,
                'surname'   => $usuario->surname,
                'public_id' => $usuario->public_id,
            ]
        ], 200);
    }


}
