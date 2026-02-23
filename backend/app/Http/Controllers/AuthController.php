<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function registroUsuario(Request $request)
    {
        // Validamos que los datos sean correctos
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'surname' => 'required|string',
            'email' => 'required|unique',
            'password' => 'required'
        ]);

        // Si falla mostramos error
        if ($validator->fails()) {
            return response(
                [
                    'message' => 'error',
                    'errors' => $validator->errors()
                ],
                400
            );
        }

        // Creamos usuario
        $usuario = User::create([
            'name' => $request->name,
            'surname' => $request->surname,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // Formateamos el id (Pasa de 1, 2, 3... a 0001, 0002, 0003...)
        $idFormateado = str_pad($usuario->id, 4, '0', STR_PAD_LEFT);
        // Actualizamos el campo public_id, con #NombreXXXX
        $usuario->public_id = "#" . $usuario->name . $idFormateado;

        // Guardamos el usuario
        $usuario->save();
    }

    public function verUsuario(){
        
    }
}
