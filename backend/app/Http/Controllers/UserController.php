<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

    public function actualizarUsuario(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string',
            'surname' => 'nullable|string',
            'email' => 'nullable|unique:users,email',
            'password' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        $usuario = User::find($id);
        if (!$usuario) {
            return response()->json([
                'message' => 'error',
                'usuario' => 'No existe ningún usuario con ese ID'
            ], 404);
        }

        // Cogemos los datos que nos haya pasado el usuario
        $datos = $request->only([
            'usuario',
            'nombre',
            'apellidos',
            'email',
            'password'
        ]);

        // Si la password no esta vacia, la encriptamos
        if (!empty($datos['password'])) {
            $datos['password'] = bcrypt($datos['password']);
        } else {
            unset($datos['password']);
        }

        // Actualizamos datos
        $usuario->update($datos);

        // Mostramos usuario actualizado
        return response()->json([
            'message' => 'success',
            'usuario' => $usuario
        ], 200);
    }

    public function borrarUsuario($id)
    {
        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json([
                'message' => 'error',
                'usuario' => 'No existe ningún usuario con ese ID'
            ], 404);
        }

        $usuario->delete();
        
        return response()->json([
            'message' => 'success',
            'usuario' => 'El usuario se ha borrado correctamente'
        ], 200);
    }
}
