<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

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

        if ($usuario) {
            return response()->json([
                'message' => 'Usuario creado correctamente'
            ], 201);
        }
    }

    public function loginUsuario(Request $request)
    {
        // Validamos que las credenciales sean correctas
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Si el validador falla, mosrtamos error
        if ($validator->fails()) {
            return response()->json([
                'message' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        // Buscamos el usuario por email
        $usuario = User::where('email', $request->email)->first();

        // Validamos credenciales
        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            return response()->json([
                'message' => 'error',
                'errors' => 'El correo o la contraseña no son correctos'
            ], 400);
        }

        // Generamos token
        $token = $usuario->createToken('auth_token')->plainTextToken;

        // Mostramos mensaje de exito y pasamos el token y el usuario
        return response()->json([
            'message' => 'Inicio de sesión correcto',
            'token' => $token,
            'usuario' => $usuario
        ], 200);
    }

    public function logoutUsuario(Request $request)
    {
        // Cerramos sesión
        Auth::logout();
        
        // Revocar todos los tokens Sanctum del usuario
        $request->user()->tokens()->delete();

        // Mostramos mensaje de exito
        return response()->json([
            'message' => 'Cierre de sesión correcto'
        ], 200);
    }
}
