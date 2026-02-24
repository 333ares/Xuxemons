<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    public function registroUsuario(Request $request)
    {
        // Validamos que los datos sean correctos
        $validator = Validator::make($request->all(), [
            'public_id' => 'nullable',
            'name' => 'required|string',
            'surname' => 'required|string',
            'email' => 'required|unique:users,email',
            'password' => 'required'
        ]);

        // Si falla mostramos error
        if ($validator->fails()) {
            return response()->json([
                'message' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        // Creamos usuario
        $usuario = User::create([
            'public_id' => '#NombreXXXX',
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
        $validator = Validator::make($request->all(), [
            'public_id' => 'required|string',
            'password'  => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'error',
                'errors'  => $validator->errors()
            ], 400);
        }

        // Buscamos el usuario por public_id manualmente
        $usuario = User::where('public_id', $request->public_id)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            return response()->json([
                'message' => 'error',
                'errors'  => 'El ID o la contraseña no son correctos'
            ], 400);
        }

        // Generamos el token a partir del usuario encontrado
        $token = JWTAuth::fromUser($usuario);

        return response()->json([
            'message' => 'Inicio de sesión correcto',
            'token'   => $token,
            'usuario' => $usuario
        ], 200);
    }

    public function logoutUsuario()
    {
        try {
            // Invalidamos el token JWT
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'error',
                'errors'  => 'No se pudo cerrar la sesión'
            ], 500);
        }

        return response()->json([
            'message' => 'Cierre de sesión correcto'
        ], 200);
    }
}
