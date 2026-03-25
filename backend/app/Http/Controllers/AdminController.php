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
        } else {
            return response()->json([
                'message' => 'error',
                'errors' => 'No tienes suficientes permisos para ejecutar esta función'
            ], 400);
        }
    }

    public function agregarObjeto(Request $request)
    {
        $admin = $request->user()->id;

        if ($admin === 1) {
            // Validamos que los datos sean validos, para vacuna y xuxe
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
                    'amount' => 'required|integer|in:1,2,3,4,5',
                    'user_id' => 'required|integer'
                ]);
            }

            // Si no lo son, devolvemos error
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'error',
                    'errors' => $validator->errors()
                ], 400);
            }

            $maxMochila = 20; // El máximo de objetos que puede tener la mochila

            // Calculamos el total de objetos que ya tiene el usuario en la mochila
            $totalActual = Mochila::where('user_id', $request->user_id)->sum('amount');

            // Si el tipo es vacuna, se añade sin importar si ya tiene o no, ya que no son apilables
            if ($request->type === "vacuna") {

                // Si la mochila está llena, no se puede añadir la vacuna
                if ($totalActual >= $maxMochila) {
                    return response()->json([
                        'message' => 'warning',
                        'warning' => 'La mochila está llena. No 
                        
                        
                        
                        se ha podido añadir la vacuna.'
                    ], 200);
                }

                $vacuna = Mochila::create([
                    'type' => $request->type,
                    'name' => $request->name,
                    'amount' => 1,
                    'stackable' => 0,
                    'user_id' => $request->user_id
                ]);

                // Si se ha añadido correctamente, devolvemos mensaje de éxito
                if ($vacuna) {
                    return response()->json([
                        'message' => 'Vacuna añadida correctamente',
                        'vacuna' => $vacuna
                    ], 201);

                    // Si no, mensaje de error
                } else {
                    return response()->json([
                        'message' => 'error',
                        'errors' => 'No se ha podido añadir la vacuna'
                    ], 400);
                }

                // Si el tipo es xuxe, se añade comprobando si ya tiene o no, ya que son apilables
            } else {
                $maxStack = 5; // El máximo de objetos que se pueden apilar

                // Calculamos cuántas xuxes se pueden añadir sin superar el límite de la mochila
                $espacioDisponible = $maxMochila - $totalActual;
                $amountReal = min($request->amount, $espacioDisponible);
                $descartadas = $request->amount - $amountReal;

                // Buscamos si ya tiene esa xuxe y si se puede apilar
                $xuxe = Mochila::where('user_id', $request->user_id)
                    ->where('name', $request->name)
                    ->where('type', 'xuxe')
                    ->where('amount', '<', $maxStack)
                    ->first();

                // Si se puede apilar
                if ($xuxe) {
                    $nuevoAmount = $xuxe->amount + $amountReal; // Calculamos el nuevo amount sumando el actual con el que se quiere añadir

                    // Si el nuevo amount es menor o igual al máximo, se actualiza el amount del stack actual
                    if ($nuevoAmount <= $maxStack) {
                        $xuxe->update([
                            'amount' => $nuevoAmount
                        ]);

                        if ($descartadas > 0) {
                            return response()->json([
                                'message' => 'warning',
                                'warning' => 'La mochila no tenía suficiente espacio. Se han descartado ' . $descartadas . ' xuxe(s).',
                                'xuxe' => $xuxe
                            ], 201);
                        } else {
                            return response()->json([
                                'message' => 'Xuxe añadida correctamente',
                                'xuxe' => $xuxe
                            ], 201);
                        }

                        // Si el nuevo amount supera el máximo, se llena el stack actual y se crea otro stack con el sobrante
                    } else {
                        // Se actualiza el stack actual al máximo
                        $xuxe->update([
                            'amount' => $maxStack
                        ]);

                        $nuevaXuxe = Mochila::create([
                            'type' => 'xuxe',
                            'name' => $request->name,
                            'amount' => $nuevoAmount - $maxStack,
                            'stackable' => 1,
                            'user_id' => $request->user_id
                        ]);

                        if ($descartadas > 0) {
                            return response()->json([
                                'message' => 'warning',
                                'warning' => 'La mochila no tenía suficiente espacio. Se han descartado ' . $descartadas . ' xuxe(s).',
                                'xuxe' => $nuevaXuxe
                            ], 201);
                        } else {
                            return response()->json([
                                'message' => 'Xuxe añadida correctamente',
                                'xuxe' => $nuevaXuxe
                            ], 201);
                        }
                    }

                    // Si no se puede apilar
                } else {
                    $xuxe = Mochila::create([
                        'type' => 'xuxe',
                        'name' => $request->name,
                        'amount' => $amountReal,
                        'stackable' => 1,
                        'user_id' => $request->user_id
                    ]);

                    if ($descartadas > 0) {
                        return response()->json([
                            'message' => 'warning',
                            'warning' => 'La mochila no tenía suficiente espacio. Se han descartado ' . $descartadas . ' xuxe(s).',
                            'xuxe' => $xuxe
                        ], 201);
                    } else {
                        // Devolvemos la xuxe añadida
                        return response()->json([
                            'message' => 'Xuxe añadida correctamente',
                            'xuxe' => $xuxe
                        ], 201);
                    }
                }
            }
            // Si el usuario no tiene suficientes permisos
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
            $numUsuarios = User::count();
            $numXuxemons = Xuxemons::count();
            $numXuxemonsEnf = Xuxemons::where('sickness', 1)->count();
            $numObjetos = Mochila::count();

            // Si no se han encontrado los usuarios, se devuelve error
            if (count($usuarios) <= 0) {
                return response()->json([
                    'message' => 'error',
                    'errors' => 'No se han podido listar los usuarios'
                ], 404);

                // Si no se devuelve la lista de usuarios
            } else {
                return response()->json([
                    'message' => 'success',
                    'usuarios' => $usuarios,
                    'totalUsuarios' => $numUsuarios,
                    'totalXuxemons' => $numXuxemons,
                    'totalXuxemonsEnfermos' => $numXuxemonsEnf,
                    'totalObjetos' => $numObjetos
                ], 200);
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
