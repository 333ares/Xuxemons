<?php

namespace App\Http\Controllers;

use App\Models\Xuxemons;
use Illuminate\Http\Request;

class XuxemonsController extends Controller
{
    public function listarXuxemons(Request $request)
    {
        // Recogemos los xuxemons del usuario que hace la petición
        $xuxemons = Xuxemons::where('user_id', $request->user()->id)->get();

        // Si el resultado es 0 o menor, se muestra error
        if (count($xuxemons) <= 0) {
            return response()->json([
                'message' => 'error',
                'errors' => 'No tienes xuxemons aún'
            ], 400);

            // Si no se devuelve la lista de xuxemons
        } else {
            return response()->json([
                'message' => 'success',
                'xuxemons' => $xuxemons
            ], 201);
        }
    }
}
