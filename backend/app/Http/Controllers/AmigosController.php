<?php

namespace App\Http\Controllers;

use App\Models\Amigo;
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

    public function enviarSolicitud(Request $request)
    {
        $senderId   = $request->user()->id;
        $receiverId = $request->receiver_id;

        // Comprobamos que no exista ya una friendship entre los dos en cualquier dirección
        $yaExiste = Amigo::where(function ($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $senderId)->where('receiver_id', $receiverId);
        })->orWhere(function ($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $receiverId)->where('receiver_id', $senderId);
        })->exists();

        if ($yaExiste) {
            return response()->json([
                'message' => 'error',
                'errors'  => 'Ya existe una solicitud o amistad con este usuario'
            ], 400);
        }

        // Creamos la solicitud con estado pendiente
        $friendship = Amigo::create([
            'sender_id'   => $senderId,
            'receiver_id' => $receiverId,
            'status'      => 'pending',
        ]);

        return response()->json([
            'message'    => 'success',
            'friendship' => $friendship
        ], 201);
    }
}
