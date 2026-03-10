<?php

namespace App\Http\Controllers;

use App\Models\Mochila;
use App\Models\Xuxemons;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\XuxemonsInfo;
use Illuminate\Support\Facades\Validator;

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

    public function agregarObjeto(Request $request)
    {
        $admin = $request->user()->id;

        if ($admin === 1) {
            if ($request->type === "vacuna") {
                $validator = Validator::make($request->all(), [
                    'type' => 'required|in:vacuna',
                    'name' => 'required|string',
                    'user_id' => 'required|integer'
                ]);
            } else {
                $validator = Validator::make($request->all(), [
                    'type' => 'required|in:xuxe',
                    'name' => 'required|string',
                    'amount' => 'required|integer',
                    'user_id' => 'required|integer'
                ]);
            }

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'error',
                    'errors' => $validator->errors()
                ], 400);
            }

            if ($request->type === "vacuna") {
                $vacuna = Mochila::create([
                    'type' => $request->type,
                    'name' => $request->name,
                    'amount' => 1,
                    'stackable' => 0,
                    'user_id' => $request->user_id
                ]);

                if ($vacuna) {
                    return response()->json([
                        'message' => 'Vacuna añadida correctamente',
                        'vacuna' => $vacuna
                    ], 201);
                } else {
                    return response()->json([
                        'message' => 'error',
                        'errors' => 'No se ha podido añadir la vacuna'
                    ], 400);
                }
            } else {
                $maxStack = 5;

                if ($request->amount > $maxStack) {

                    $primero = Mochila::create([
                        'type' => 'xuxe',
                        'name' => $request->name,
                        'amount' => $maxStack,
                        'stackable' => 1,
                        'user_id' => $request->user_id
                    ]);

                    $segundo = Mochila::create([
                        'type' => 'xuxe',
                        'name' => $request->name,
                        'amount' => $request->amount - $maxStack,
                        'stackable' => 1,
                        'user_id' => $request->user_id
                    ]);

                    return response()->json([
                        'message' => 'Xuxe separada en stacks',
                        'xuxe1' => $primero,
                        'xuxe2' => $segundo
                    ], 201);
                } else {

                    $xuxe = Mochila::create([
                        'type' => 'xuxe',
                        'name' => $request->name,
                        'amount' => $request->amount,
                        'stackable' => 1,
                        'user_id' => $request->user_id
                    ]);

                    return response()->json([
                        'message' => 'Xuxe añadida correctamente',
                        'xuxe' => $xuxe
                    ], 201);
                }
            }
        } else {
            return response()->json([
                'message' => 'error',
                'errors' => 'No tienes suficientes permisos para ejecutar esta función'
            ], 400);
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

    public function navegadorUsuarios(Request $request)
    {
        // Validamos que los datos sean validos
        $validator = Validator::make($request->all(), [
            'nav' => 'required|string'
        ]);

        // Si no lo son, devolvemos error
        if ($validator->fails()) {
            return response()->json([
                'message' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        // Cogemos el contenido del navegador
        $buscar = $request->nav;

        // Buscamos los usuarios coincidan con el nombre que ha puesto
        $usuarios = User::where('name', 'LIKE', "%{$buscar}%")
            ->orWhere('surname', 'LIKE', "%{$buscar}%")
            ->orWhere('email', 'LIKE', "%{$buscar}%")
            ->orWhere('public_id', 'LIKE', "%{$buscar}%")
            ->get();

        // Si no se encuentram devovlemos error
        if (count($usuarios) <= 0) {
            return response()->json([
                'message' => 'error',
                'errors' => 'Sin resultados, prueba a poner otros parametros...'
            ], 404);

            // Si se encuentran, devolvemos la lista
        } else {
            return response()->json([
                'message' => 'success',
                'usuarios' => $usuarios
            ], 200);
        }
    }
}
