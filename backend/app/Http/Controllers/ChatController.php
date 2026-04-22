<?php

namespace App\Http\Controllers;

use App\Models\Amigo;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * GET /chat/conversaciones
     * Devuelve la lista de amigos con el último mensaje y los no leídos.
     * Solo los amigos aceptados pueden tener conversación.
     */
    public function listarConversaciones(Request $request)
    {
        $userId = $request->user()->id;

        // Cogemos todas las friendships aceptadas del usuario
        $friendships = Amigo::where('status', 'accepted')
            ->where(function ($q) use ($userId) {
                $q->where('sender_id', $userId)->orWhere('receiver_id', $userId);
            })
            ->with([
                'sender:id,name,surname,public_id',
                'receiver:id,name,surname,public_id',
            ])
            ->get();

        // Para cada amistad construimos el objeto de conversación
        $conversaciones = $friendships->map(function ($f) use ($userId) {
            $amigo = $f->sender_id === $userId ? $f->receiver : $f->sender;
            $amigoId = $amigo->id;

            // Último mensaje entre los dos usuarios (en cualquier dirección)
            $ultimoMensaje = Message::where(function ($q) use ($userId, $amigoId) {
                $q->where('sender_id', $userId)->where('receiver_id', $amigoId);
            })->orWhere(function ($q) use ($userId, $amigoId) {
                $q->where('sender_id', $amigoId)->where('receiver_id', $userId);
            })->orderByDesc('created_at')->first();

            // Mensajes que el amigo me ha enviado y no he leído aún
            $noLeidos = Message::where('sender_id', $amigoId)
                ->where('receiver_id', $userId)
                ->whereNull('read_at')
                ->count();

            return [
                'user_id'           => $amigoId,
                'name'              => $amigo->name,
                'surname'           => $amigo->surname,
                'public_id'         => $amigo->public_id,
                'ultimo_mensaje'    => $ultimoMensaje?->content,
                'ultimo_mensaje_at' => $ultimoMensaje?->created_at,
                'unread'            => $noLeidos,
            ];
        })
        ->sortByDesc('ultimo_mensaje_at')
        ->values();

        return response()->json([
            'message'        => 'success',
            'conversaciones' => $conversaciones,
        ], 200);
    }

    /**
     * GET /chat/mensajes/{userId}
     * Devuelve el historial completo de mensajes entre el usuario autenticado y userId.
     * Solo funciona si son amigos.
     */
    public function listarMensajes(Request $request, $userId)
    {
        $myId = $request->user()->id;

        // Verificamos que son amigos antes de mostrar mensajes
        $sonAmigos = Amigo::where('status', 'accepted')
            ->where(function ($q) use ($myId, $userId) {
                $q->where('sender_id', $myId)->where('receiver_id', $userId);
            })->orWhere(function ($q) use ($myId, $userId) {
                $q->where('sender_id', $userId)->where('receiver_id', $myId);
            })->exists();

        if (!$sonAmigos) {
            return response()->json([
                'message' => 'error',
                'errors'  => 'No puedes ver los mensajes de alguien que no es tu amigo',
            ], 403);
        }

        $mensajes = Message::where(function ($q) use ($myId, $userId) {
            $q->where('sender_id', $myId)->where('receiver_id', $userId);
        })->orWhere(function ($q) use ($myId, $userId) {
            $q->where('sender_id', $userId)->where('receiver_id', $myId);
        })->orderBy('created_at', 'asc')->get();

        return response()->json([
            'message'  => 'success',
            'mensajes' => $mensajes,
        ], 200);
    }

    /**
     * POST /chat/mensaje
     * Envía un mensaje a un usuario. Solo entre amigos.
     */
    public function enviarMensaje(Request $request)
    {
        $myId      = $request->user()->id;
        $receiverId = $request->receiver_id;
        $content   = trim($request->content ?? '');

        if (empty($content)) {
            return response()->json([
                'message' => 'error',
                'errors'  => 'El mensaje no puede estar vacío',
            ], 400);
        }

        // Solo se puede enviar mensajes a amigos
        $sonAmigos = Amigo::where('status', 'accepted')
            ->where(function ($q) use ($myId, $receiverId) {
                $q->where('sender_id', $myId)->where('receiver_id', $receiverId);
            })->orWhere(function ($q) use ($myId, $receiverId) {
                $q->where('sender_id', $receiverId)->where('receiver_id', $myId);
            })->exists();

        if (!$sonAmigos) {
            return response()->json([
                'message' => 'error',
                'errors'  => 'Solo puedes enviar mensajes a tus amigos',
            ], 403);
        }

        $mensaje = Message::create([
            'sender_id'   => $myId,
            'receiver_id' => $receiverId,
            'content'     => $content,
        ]);

        return response()->json([
            'message' => 'success',
            'mensaje' => $mensaje,
        ], 201);
    }

    /**
     * PUT /chat/leidos/{userId}
     * Marca como leídos todos los mensajes que userId me ha enviado.
     */
    public function marcarLeidos(Request $request, $userId)
    {
        $myId = $request->user()->id;

        Message::where('sender_id', $userId)
            ->where('receiver_id', $myId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'message' => 'success',
        ], 200);
    }
}
