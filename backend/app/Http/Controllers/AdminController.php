<?php

namespace App\Http\Controllers;

use App\Models\Xuxemons;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AdminController extends Controller
{
    public function agregarXuxemon(Request $request)
    {
        /*
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
        }*/
    }

    public function listarUsuarios(Request $request)
    {
        $admin = $request->user()->id;

        if ($admin === 1) {
            $usuarios = User::all();

            if (!$usuarios) {
                return response()->json([
                    'message' => 'error',
                    'errors' => 'No se han podido listar los usuarios'
                ], 404);
            } else {
                return response()->json([
                    'message' => 'success',
                    'xuxemons' => $usuarios
                ], 201);
            }
            
        } else {
             return response()->json([
                    'message' => 'error',
                    'errors' => 'No tienes suficientes permisos para ejecutar esta función'
                ], 400);
        }
    }
}
