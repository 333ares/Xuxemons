<?php

namespace App\Http\Controllers;

use App\Models\Xuxemons;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\XuxemonsInfo;

class AdminController extends Controller
{
    public function agregarXuxemon(Request $request)
    {
        // Cogemos el id del usuario que hace la petición
        $admin = $request->user()->id;

        // Si el id es 1, es el admin
        if ($admin === 1) {
            // Randomizamos un número del 1 al 48 (total de xuxemons)
            $xuxemon_id = random_int(1, 48);

            // Buscamos el id randomizado
            $xuxemon = XuxemonsInfo::where('id', $xuxemon_id)->first();

            // Si no se encuentra, mostramos error
            if (!$xuxemon) {
                return response()->json([
                    'message' => 'error',
                    'errors' => 'No se ha encontrado un xuxemon con ese id'
                ], 400);
            }

            // Añadimos el xuxemon 
            $xuxemonUsuario = Xuxemons::create([
                'name' => $xuxemon->name,
                'type' => $xuxemon->type,
                'user_id' => $request->user_id,
            ]);

            if ($xuxemonUsuario) {
                return response()->json([
                    'message' => 'Xuxemon añadido correctamente',
                    'xuxemon' => $xuxemon
                ], 201);
            } else {
                return response()->json([
                    'message' => 'error',
                    'errors' => 'No se ha podido añadir el xuxemon'
                ], 400);
            }
        }
    }

    public function listarUsuarios(Request $request)
    {
        // Cogemos el id del usuario que hace la petición
        $admin = $request->user()->id;

        // Si el id es 1, es el admin
        if ($admin === 1) {
            // Recogemos todos los datos de los usuarios
            $usuarios = User::all();

            // Si no se han encontrado los usuarios, se devuelve error
            if (!$usuarios) {
                return response()->json([
                    'message' => 'error',
                    'errors' => 'No se han podido listar los usuarios'
                ], 404);

                // Si no se devuelve la lista de usuarios
            } else {
                return response()->json([
                    'message' => 'success',
                    'xuxemons' => $usuarios
                ], 201);
            }
            // Si no es el admin, se muestra error de falta de permisos
        } else {
            return response()->json([
                'message' => 'error',
                'errors' => 'No tienes suficientes permisos para ejecutar esta función'
            ], 400);
        }
    }
}
