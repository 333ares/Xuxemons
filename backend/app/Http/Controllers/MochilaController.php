<?php

namespace App\Http\Controllers;

use App\Models\Mochila;
use Illuminate\Http\Request;

class MochilaController extends Controller
{
    public function listarObjetos(Request $request)
    {
        $objetos = Mochila::where('user_id', $request->user()->id)->paginate(9);

        if (count($objetos) <= 0) {
            return response()->json([
                'message' => 'error',
                'errors' => 'Mochila vacía'
            ], 404);
        } else {
            return response()->json([
                'message' => 'success',
                'objetos' => $objetos
            ], 201);
        }
    }

    public function borrarObjeto(Request $request)
    {
        $objeto = Mochila::where('user_id', $request->user()->id)
            ->where('id', $request->id)
            ->first();

        if (!$objeto) {
            return response()->json([
                'message' => 'error',
                'errors' => 'No se ha encontrado el objeto'
            ], 404);
        }

        // Si es apilable y tiene más de 1, restamos 1 unidad
        if ($objeto->stackable && $objeto->amount > 1) {
            $objeto->update([
                'amount' => $objeto->amount - 1
            ]);

            return response()->json([
                'message' => 'success',
                'objeto' => 'Se ha eliminado una unidad del objeto'
            ], 200);
        }

        // Si no es apilable o solo queda 1, borramos el objeto entero
        $objeto->delete();

        return response()->json([
            'message' => 'success',
            'objeto' => 'El objeto se ha borrado correctamente'
        ], 200);
    }
}
