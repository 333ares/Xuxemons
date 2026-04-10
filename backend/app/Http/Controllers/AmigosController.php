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
                'errors' => 'No se ha encontrado ningún jugador con ese ID'
            ], 404);
        }

        // Devolvemos solo los campos publicos (nunca la contraseña)
        return response()->json([
            'message' => 'success',
            'usuario' => [
                'public_id' => $usuario->public_id,
                'name' => $usuario->name,
                'surname' => $usuario->surname,
                'email' => $usuario->email
            ]
        ], 200);
    }

    public function enviarSolicitud(Request $request)
    {
        $senderId = $request->user()->id;
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
                'errors' => 'Ya existe una solicitud o amistad con este usuario'
            ], 400);
        }

        // Creamos la solicitud con estado pendiente
        $friendship = Amigo::create([
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'success',
            'friendship' => $friendship
        ], 201);
    }

    public function listarSolicitudes(Request $request)
    {
        // Devolvemos las solicitudes pendientes donde el usuario es el receptor
        $solicitudes = Amigo::where('receiver_id', $request->user()->id)
            ->where('status', 'pending')
            ->with(['sender:id,name,surname,public_id'])
            ->get()
            ->map(function ($f) {
                // Aplanamos los datos del remitente para que el front los use directamente
                return [
                    'id' => $f->id,
                    'name' => $f->sender->name,
                    'surname' => $f->sender->surname,
                    'public_id' => $f->sender->public_id,
                ];
            });

        return response()->json([
            'message' => 'success',
            'solicitudes' => $solicitudes
        ], 200);
    }

    public function aceptarSolicitud(Request $request)
    {
        // Buscamos la solicitud verificando que el usuario autenticado es el receptor
        $friendship = Amigo::where('id', $request->friendship_id)
            ->where('receiver_id', $request->user()->id)
            ->first();

        // Si no la encontramos, devolvemos error
        if (!$friendship) {
            return response()->json([
                'message' => 'error',
                'errors' => 'No se ha encontrado la solicitud'
            ], 404);
        }

        // Cambiamos el estado a aceptado
        $friendship->update(['status' => 'accepted']);

        // Devolvemos los datos del nuevo amigo para que el front actualice la lista sin recargar
        $amigo = User::select('id', 'name', 'surname', 'public_id')
            ->find($friendship->sender_id);

        return response()->json([
            'message' => 'success',
            'amigo' => $amigo
        ], 200);
    }

    public function rechazarSolicitud(Request $request)
    {
        // Buscamos la solicitud verificando que el usuario autenticado es el receptor
        $friendship = Amigo::where('id', $request->friendship_id)
            ->where('receiver_id', $request->user()->id)
            ->first();

        // Si no la encontramos, devolvemos error
        if (!$friendship) {
            return response()->json([
                'message' => 'error',
                'errors' => 'No se ha encontrado la solicitud'
            ], 404);
        }

        // Eliminamos el registro directamente
        $friendship->delete();

        return response()->json([
            'message' => 'success',
            'errors' => 'Solicitud rechazada correctamente'
        ], 200);
    }

    public function listarAmigos(Request $request)
    {
        $userId = $request->user()->id;

        // Cogemos todas las friendships aceptadas donde el usuario sea sender o receiver
        $friendships = Amigo::where('status', 'accepted')
            ->where(function ($q) use ($userId) {
                $q->where('sender_id', $userId)->orWhere('receiver_id', $userId);
            })
            ->with([
                'sender:id,name,surname,public_id',
                'receiver:id,name,surname,public_id',
            ])
            ->get();

        // Mapeamos para devolver siempre los datos del otro usuario, no del propio
        $amigos = $friendships->map(function ($f) use ($userId) {
            $amigo = $f->sender_id === $userId ? $f->receiver : $f->sender;

            return [
                'id' => $f->id, // id de la friendship (para eliminar)
                'name' => $amigo->name,
                'surname' => $amigo->surname,
                'public_id' => $amigo->public_id,
            ];
        });

        return response()->json([
            'message' => 'success',
            'amigos' => $amigos
        ], 200);
    }

    public function eliminarAmigo(Request $request, $id)
    {
        $userId = $request->user()->id;

        // Buscamos la friendship donde el usuario autenticado sea sender o receiver
        $friendship = Amigo::where('id', $id)
            ->where(function ($q) use ($userId) {
                $q->where('sender_id', $userId)->orWhere('receiver_id', $userId);
            })
            ->first();

        // Si no la encontramos, devolvemos error
        if (!$friendship) {
            return response()->json([
                'message' => 'error',
                'errors'  => 'No se ha encontrado la amistad'
            ], 404);
        }

        // Al borrar el registro desaparece de los dos lados
        $friendship->delete();

        return response()->json([
            'message' => 'success',
            'errors'  => 'Amigo eliminado correctamente'
        ], 200);
    }
}
