<?php

namespace App\Http\Controllers;

use App\Models\Batalla;
use App\Models\User;
use Illuminate\Http\Request;

class BatallaController extends Controller
{
    public function enviarSolicitud(Request $request)
    {
        $senderId   = $request->user()->id;
        $receiverId = $request->receiver_id;

        // No puedes retarte a ti mismo
        if ($senderId === $receiverId) {
            return response()->json([
                'message' => 'error',
                'errors'  => 'No puedes retarte a ti mismo'
            ], 400);
        }

        // Comprobamos que no exista ya un reto pendiente entre los dos
        $yaExiste = Batalla::where(function ($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $senderId)->where('receiver_id', $receiverId);
        })->orWhere(function ($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $receiverId)->where('receiver_id', $senderId);
        })->where('status', 'pending')->exists();

        if ($yaExiste) {
            return response()->json([
                'message' => 'error',
                'errors'  => 'Ya existe un reto pendiente con este jugador'
            ], 400);
        }

        $reto = Batalla::create([
            'sender_id'   => $senderId,
            'receiver_id' => $receiverId,
            'status'      => 'pending',
        ]);

        return response()->json([
            'message' => 'success',
            'reto'    => $reto
        ], 201);
    }

    public function listarSolicitudes(Request $request)
    {
        // Devuelve los retos pendientes donde el usuario autenticado es el receptor
        $retos = Batalla::where('receiver_id', $request->user()->id)
            ->where('status', 'pending')
            ->with(['sender:id,name,surname,public_id'])
            ->get()
            ->map(function ($r) {
                return [
                    'id'        => $r->id,
                    'nombre'    => $r->sender->name,
                    'public_id' => $r->sender->public_id,
                ];
            });

        return response()->json([
            'message' => 'success',
            'retos'   => $retos
        ], 200);
    }

    public function aceptarSolicitud(Request $request)
    {
        $reto = Batalla::where('id', $request->reto_id)
            ->where('receiver_id', $request->user()->id)
            ->where('status', 'pending')
            ->first();

        if (!$reto) {
            return response()->json([
                'message' => 'error',
                'errors'  => 'No se ha encontrado el reto'
            ], 404);
        }

        $reto->update(['status' => 'accepted']);

        return response()->json([
            'message' => 'success',
            'reto'    => $reto
        ], 200);
    }

    public function rechazarSolicitud(Request $request)
    {
        $reto = Batalla::where('id', $request->reto_id)
            ->where('receiver_id', $request->user()->id)
            ->where('status', 'pending')
            ->first();

        if (!$reto) {
            return response()->json([
                'message' => 'error',
                'errors'  => 'No se ha encontrado el reto'
            ], 404);
        }

        $reto->delete();

        return response()->json([
            'message' => 'success',
            'errors'  => 'Reto rechazado correctamente'
        ], 200);
    }
}
