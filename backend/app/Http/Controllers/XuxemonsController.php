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

    public function listarXuxemonsAire(Request $request)
    {
        // Si el tipo que pide el usuario es aire
        if ($request->type == 'aire') {
            // Cogemos todos los xuxemons del usuario de tipo "aire"
            $xuxemons = Xuxemons::where('user_id', $request->user()->id)
                ->where('type', 'aire')
                ->get();

            // Si no encuentra, mostramos error
            if (!$xuxemons) {
                return response()->json([
                    'message' => 'error',
                    'errors' => 'No tienes xuxemons de tipo aire aún'
                ], 400);

                // Si encuentra, los devolvemos
            } else {
                return response()->json([
                    'message' => 'success',
                    'xuxemons' => $xuxemons
                ], 201);
            }
        }
    }

    public function listarXuxemonsTierra(Request $request)
    {
        if ($request->type == 'tierra') {
            $xuxemons = Xuxemons::where('user_id', $request->user()->id)
                ->where('type', 'tierra')
                ->get();

            if (!$xuxemons) {
                return response()->json([
                    'message' => 'error',
                    'errors' => 'No tienes xuxemons de tipo tierra aún'
                ], 400);
            } else {
                return response()->json([
                    'message' => 'success',
                    'xuxemons' => $xuxemons
                ], 201);
            }
        }
    }

    public function listarXuxemonsAgua(Request $request)
    {
        if ($request->type == 'agua') {
            $xuxemons = Xuxemons::where('user_id', $request->user()->id)
                ->where('type', 'agua')
                ->get();

            if (!$xuxemons) {
                return response()->json([
                    'message' => 'error',
                    'errors' => 'No tienes xuxemons de tipo agua aún'
                ], 400);
            } else {
                return response()->json([
                    'message' => 'success',
                    'xuxemons' => $xuxemons
                ], 201);
            }
        }
    }

    public function listarXuxemonsS(Request $request)
    {
        // Si el tamaño que pide el usuario es S 
        if ($request->size == 's') {
            $xuxemons = Xuxemons::where('user_id', $request->user()->id)
                ->where('size', 's')
                ->get();

            // Cogemos todos los xuxemons del usuario de tamaño "s"
            if (!$xuxemons) {
                return response()->json([
                    'message' => 'error',
                    'errors' => 'No tienes xuxemons pequeños aún'
                ], 400);

                // Si encuentra, los devolvemos
            } else {
                return response()->json([
                    'message' => 'success',
                    'xuxemons' => $xuxemons
                ], 201);
            }
        }
    }

    public function listarXuxemonsM(Request $request)
    {
        if ($request->size == 'm') {
            $xuxemons = Xuxemons::where('user_id', $request->user()->id)
                ->where('size', 'm')
                ->get();

            if (!$xuxemons) {
                return response()->json([
                    'message' => 'error',
                    'errors' => 'No tienes xuxemons medianos aún'
                ], 400);
            } else {
                return response()->json([
                    'message' => 'success',
                    'xuxemons' => $xuxemons
                ], 201);
            }
        }
    }

    public function listarXuxemonsL(Request $request)
    {
        if ($request->size == 'l') {
            $xuxemons = Xuxemons::where('user_id', $request->user()->id)
                ->where('size', 'l')
                ->get();

            if (!$xuxemons) {
                return response()->json([
                    'message' => 'error',
                    'errors' => 'No tienes xuxemons grandes aún'
                ], 400);
            } else {
                return response()->json([
                    'message' => 'success',
                    'xuxemons' => $xuxemons
                ], 201);
            }
        }
    }
}
