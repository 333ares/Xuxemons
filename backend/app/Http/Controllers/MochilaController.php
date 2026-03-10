<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MochilaController extends Controller
{
    public function listarObjetos(Request $request)
    {
        $objetos = Mochila::where('user_id', $request->user()->id)->get();

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
}
