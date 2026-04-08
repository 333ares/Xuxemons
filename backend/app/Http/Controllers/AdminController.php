<?php

namespace App\Http\Controllers;

use App\Models\Mochila;
use App\Models\Xuxemons;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\XuxemonsInfo;
use Illuminate\Support\Facades\Validator;
use App\Models\ConfigXuxes;
use App\Models\ConfigXuxemon;
use App\Models\ConfigAlimentar;

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

            // Check general para vacuna Y xuxe
            if ($totalActual >= $maxMochila) {
                return response()->json([
                    'message' => 'warning',
                    'warning' => 'La mochila está llena. No se ha podido añadir el objeto.'
                ], 200);
            }

            // Si el tipo es vacuna, se añade sin importar si ya tiene o no, ya que no son apilables
            if ($request->type === "vacuna") {
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
                $espacioDisponible = $maxMochila - $totalActual;
                $amountReal = max(0, min($request->amount, $espacioDisponible)); // Asegurar que nunca sea negativo
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
            $usuarios = User::all()->map(function ($user) {
                $user->xuxemons = Xuxemons::where('user_id', $user->id)->count();
                $user->objetos = Mochila::where('user_id', $user->id)->sum('amount');
                return $user;
            });

            // Datos generales
            $numUsuarios = $usuarios->count();
            $numXuxemons = Xuxemons::count();
            $numXuxemonsEnf = Xuxemons::whereNotNull('sickness')->count();
            $numObjetos = Mochila::sum('amount');

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

    public function xuxesDiarias(Request $request)
    {
        $admin = $request->user()->id;

        if ($admin === 1) {
            // Validamos los datos
            $validator = Validator::make($request->all(), [
                'cantidad' => 'required|integer|min:1',
                'hora' => 'required|date_format:H:i'
            ]);

            // Si no lo son, devolvemos error
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'error',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Actualizamos la configuración (siempre hay un solo registro)
            $config = ConfigXuxes::first();

            $config->update([
                'cantidad' => $request->cantidad,
                'hora' => $request->hora
            ]);

            // Si se ha actualizado correctamente, devolvemos mensaje de éxito
            if ($config) {
                return response()->json([
                    'message' => 'Configuración actualizada correctamente',
                    'config' => $config
                ], 200);

                // Si no, mensaje de error
            } else {
                return response()->json([
                    'message' => 'error',
                    'errors' => 'No se ha podido actualizar la configuración'
                ], 400);
            }

            // Si el usuario no tiene suficientes permisos
        } else {
            return response()->json([
                'message' => 'error',
                'errors' => 'No tienes suficientes permisos para ejecutar esta función'
            ], 400);
        }
    }

    public function xuxemonDiario(Request $request)
    {
        $admin = $request->user()->id;

        if ($admin === 1) {
            $validator = Validator::make($request->all(), [
                'hora' => 'required|date_format:H:i'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'error',
                    'errors'  => $validator->errors()
                ], 400);
            }

            $config = ConfigXuxemon::first();

            $config->update([
                'hora' => $request->hora
            ]);

            if ($config) {
                return response()->json([
                    'message' => 'Configuración actualizada correctamente',
                    'config'  => $config
                ], 200);
            } else {
                return response()->json([
                    'message' => 'error',
                    'errors'  => 'No se ha podido actualizar la configuración'
                ], 400);
            }
        } else {
            return response()->json([
                'message' => 'error',
                'errors'  => 'No tienes suficientes permisos para ejecutar esta función'
            ], 400);
        }
    }

    public function resetConfig(Request $request)
    {
        if ($request->user()->id === 1) {
            ConfigXuxes::first()->update(['ultima_entrega' => null]);
            ConfigXuxemon::first()->update(['ultima_entrega' => null]);

            return response()->json(['message' => 'Config reseteada correctamente'], 200);
        }
    }

    public function getConfigDiaria(Request $request)
    {
        if ($request->user()->id === 1) {
            $configXuxes = ConfigXuxes::first();
            $configXuxemon = ConfigXuxemon::first();

            return response()->json([
                'xuxes' => [
                    'hora'    => $configXuxes->hora,
                    'cantidad' => $configXuxes->cantidad
                ],
                'xuxemons' => [
                    'hora' => $configXuxemon->hora
                ]
            ], 200);
        }
    }

    public function configAlimentar(Request $request)
    {
        if ($request->user()->id === 1) {
            $validator = Validator::make($request->all(), [
                'porcentaje_bajon' => 'nullable|integer|min:1|max:100',
                'porcentaje_sobredosis' => 'nullable|integer|min:1|max:100',
                'porcentaje_atracon' => 'nullable|integer|min:1|max:100',
                'xuxes_s_a_m' => 'nullable|integer|min:1',
                'xuxes_m_a_g' => 'nullable|integer|min:1'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'error',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Validamos que los porcentajes no superen 100 en total
            if ($request->porcentaje_bajon && $request->porcentaje_sobredosis && $request->porcentaje_atracon) {
                $totalPorcentaje = $request->porcentaje_bajon + $request->porcentaje_sobredosis + $request->porcentaje_atracon;
                if ($totalPorcentaje > 100) {
                    return response()->json([
                        'message' => 'error',
                        'errors'  => 'La suma de los porcentajes no puede superar 100'
                    ], 400);
                }
            }

            $config = ConfigAlimentar::first();
            // array_filter elimina los valores null, así solo actualiza los campos que vienen en el request
            $config->update(array_filter([
                'porcentaje_bajon'      => $request->porcentaje_bajon,
                'porcentaje_sobredosis' => $request->porcentaje_sobredosis,
                'porcentaje_atracon'    => $request->porcentaje_atracon,
                'xuxes_s_a_m'          => $request->xuxes_s_a_m,
                'xuxes_m_a_g'          => $request->xuxes_m_a_g
            ]));

            return response()->json([
                'message' => 'Configuración actualizada correctamente',
                'config' => $config
            ], 200);
        } else {
            return response()->json([
                'message' => 'error',
                'errors' => 'No tienes suficientes permisos para ejecutar esta función'
            ], 400);
        }
    }

    public function getConfigAlimentar(Request $request)
    {
        if ($request->user()->id === 1) {
            $config = ConfigAlimentar::first();

            return response()->json([
                'message' => 'success',
                'config'  => $config
            ], 200);
        } else {
            return response()->json([
                'message' => 'error',
                'errors'  => 'No tienes suficientes permisos para ejecutar esta función'
            ], 400);
        }
    }
}
