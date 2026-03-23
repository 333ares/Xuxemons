<?php

namespace App\Http\Controllers;

use App\Models\Xuxemons;
use Illuminate\Http\Request;

class XuxemonsController extends Controller
{
    public function listarXuxemons(Request $request)
    {
        // Recogemos los xuxemons del usuario que hace la petición
        $xuxemons = Xuxemons::where('user_id', $request->user()->id)
            ->paginate(9);

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

    public function listarXuxemonsPorTipo(Request $request)
    {
        // Cogemos todos los xuxemons del usuario 
        $xuxemon = Xuxemons::where('user_id', $request->user()->id);

        // Del tipo que el usuario indique
        if ($request->type) {
            $xuxemon->where('type', $request->type);
        }

        // Devolvemos los datos paginados
        $xuxemons = $xuxemon->paginate(9);

        // Enviamos los xuxemons
        return response()->json([
            'message' => 'success',
            'xuxemons' => $xuxemons
        ], 200);
    }

    public function listarXuxemonsPorTamano(Request $request)
    {
        // Cogemos todos los xuxemons del usuario 
        $xuxemon = Xuxemons::where('user_id', $request->user()->id);

        // Del tipo que el usuario indique
        if ($request->size) {
            $xuxemon->where('size', $request->size);
        }

        // Devolvemos los datos paginados
        $xuxemons = $xuxemon->paginate(9);

        // Enviamos los xuxemons
        return response()->json([
            'message' => 'success',
            'xuxemons' => $xuxemons
        ], 200);
    }

    public function borrarXuxemon(Request $request)
    {
        // Buscamos que el usuario tenga en propiedad el xuxemon
        $xuxemon = Xuxemons::where('user_id', $request->user()->id)
            ->where('id', $request->id)
            ->first();

        // Si no se encuentra, se muestra error
        if (!$xuxemon) {
            return response()->json([
                'message' => 'error',
                'usuario' => 'No tienes ningún xuxemon con ese ID'
            ], 404);
        }

        // Borrar xuxemon
        $xuxemon->delete();

        // Devolvemos mensaje de éxito
        return response()->json([
            'message' => 'success',
            'usuario' => 'El xuxemon se ha borrado correctamente'
        ], 200);
    }
}
