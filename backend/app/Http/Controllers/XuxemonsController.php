<?php

namespace App\Http\Controllers;

use App\Models\Xuxemons;
use Illuminate\Http\Request;

class XuxemonsController extends Controller
{
    public function listarXuxemons(Request $request)
    {
        $xuxemons = Xuxemons::where('user_id', $request->user()->id)->get();

        if (count($xuxemons) <= 0) {
            return response()->json([
                'message' => 'error',
                'errors' => 'No tienes xuxemons aún'
            ], 400);

        } else {
            return response()->json([
                'message' => 'success',
                'xuxemons' => $xuxemons
            ], 201);
        }
    }
}
