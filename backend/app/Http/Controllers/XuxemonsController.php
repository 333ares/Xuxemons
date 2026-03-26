<?php

namespace App\Http\Controllers;

use App\Models\Xuxemons;
use Illuminate\Http\Request;
use App\Models\Mochila;

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

    public function alimentarXuxemon(Request $request)
    {
        $xuxemon = Xuxemons::where('user_id', $request->user()->id)
            ->where('id', $request->id)
            ->first();

        if (!$xuxemon) {
            return response()->json([
                'message' => 'error',
                'errors' => 'No tienes ningún xuxemon con ese ID'
            ], 404);
        }

        if ($xuxemon->sickness === 'atracon') {
            return response()->json([
                'message' => 'error',
                'errors' => 'Tu xuxemon tiene atracón y no puede comer'
            ], 400);
        }

        $xuxe = Mochila::where('user_id', $request->user()->id)
            ->where('type', 'xuxe')
            ->first();

        if (!$xuxe) {
            return response()->json([
                'message' => 'error',
                'errors' => 'Tu mochila esta vacía'
            ], 400);
        }

        if ($xuxe->amount <= 1) {
            $xuxe->delete();
        } else {
            $xuxe->update([
                'amount' => $xuxe->amount - 1
            ]);
        }

        if ($xuxemon->sickness === null) {
            $rand = rand(1, 100);

            if ($rand <= 5) {
                $xuxemon->sickness = 'bajon de azucar';
            } elseif ($rand <= 15) {
                $xuxemon->sickness = 'sobredosis de azucar';
            } elseif ($rand <= 30) {
                $xuxemon->sickness = 'atracon';
            }
        }

        // Calculamos las Xuxes necesarias para subir de nivel según el tamaño
        $xuxesParaSubir = match ($xuxemon->size) {
            's' => 3,
            'm' => 5,
            default => null
        };

        // Si tiene bajón de azúcar necesita dos xuxes mas para subir de nivel
        if ($xuxemon->sickness === 'bajon de azucar' && $xuxesParaSubir !== null) {
            $xuxesParaSubir += 2;
        }

        // Sumamos 1 al contador de Xuxes del xuxemon
        $xuxemon->xuxes_count += 1;

        // Si ha llegado al límite, sube de nivel y se resetea el contador
        if ($xuxesParaSubir !== null && $xuxemon->xuxes_count >= $xuxesParaSubir) {
            $xuxemon->xuxes_count = 0;
            $xuxemon->size = match ($xuxemon->size) {
                's' => 'm',
                'm' => 'g',
                default => $xuxemon->size
            };
        }

        $xuxemon->save();

        return response()->json([
            'message' => 'success',
            'xuxemon' => $xuxemon
        ], 200);
    }

    public function curarXuxemon(Request $request)
    {
        $xuxemon = Xuxemons::where('user_id', $request->user()->id)
            ->where('id', $request->id)
            ->first();

        // Si no se encuentra el xuxemon, devolvemos error
        if (!$xuxemon) {
            return response()->json([
                'message' => 'error',
                'errors' => 'No tienes ningún xuxemon con ese ID'
            ], 404);
        }

        // Si el xuxemon no está enfermo, devolvemos error
        if ($xuxemon->sickness === null) {
            return response()->json([
                'message' => 'error',
                'errors' => 'Tu xuxemon no está enfermo'
            ], 400);
        }

        // Mapeamos cada enfermedad con su vacuna correspondiente
        $vacunaRequerida = match ($xuxemon->sickness) {
            'bajon de azucar' => 'xocolatina',
            'atracon' => 'xal de fruites',
            default => null
        };

        // Buscamos primero si tiene Insulina (cura todas las enfermedades)
        $vacuna = Mochila::where('user_id', $request->user()->id)
            ->where('type', 'vacuna')
            ->where('name', 'inxulina')
            ->first();

        // Si no tiene Insulina, buscamos la vacuna específica para la enfermedad
        if (!$vacuna) {
            // Si la enfermedad no tiene vacuna específica mapeada, devolvemos error
            if ($vacunaRequerida === null) {
                return response()->json([
                    'message' => 'error',
                    'errors' => 'No existe vacuna para esta enfermedad'
                ], 400);
            }

            $vacuna = Mochila::where('user_id', $request->user()->id)
                ->where('type', 'vacuna')
                ->where('name', $vacunaRequerida)
                ->first();

            // Si no tiene la vacuna específica, devolvemos error
            if (!$vacuna) {
                return response()->json([
                    'message' => 'error',
                    'errors' => 'No tienes la vacuna necesaria para curar esta enfermedad. Necesitas: ' . $vacunaRequerida
                ], 400);
            }
        }

        // Curamos el xuxemon y eliminamos la vacuna usada
        $xuxemon->sickness = null;
        $xuxemon->save();

        $vacuna->delete();

        return response()->json([
            'message' => 'success',
            'xuxemon' => $xuxemon
        ], 200);
    }
}
