<?php

namespace App\Http\Controllers;

use App\Models\Xuxemons;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function agregarXuxemon(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'type' => 'required|in:aire,tierra,agua',
            'user_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        $xuxemon = Xuxemons::create([
            'name' => $request->name,
            'type' => $request->type,
            'user_id' => $request->user_id,
        ]);

        if ($xuxemon) {
            return response()->json([
                'message' => 'Xuxemon añadido correctamente'
            ], 201);

            // Si no, mostramos el error
        } else {
            return response()->json([
                'message' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }
    }
}
