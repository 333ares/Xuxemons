<?php

namespace App\Jobs;

use App\Models\Mochila;
use App\Models\User;
use App\Models\ConfigXuxes;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RepartirXuxesDiarias implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $config = ConfigXuxes::first();

        // Comprobamos que no se haya repartido ya hoy
        if ($config->ultima_entrega === now()->toDateString()) {
            return;
        }

        $cantidadTotal = $config->cantidad;
        $maxMochila = 20;
        $maxStack = 5;

        // Recorremos todos los usuarios
        $usuarios = User::all();

        foreach ($usuarios as $usuario) {
            // Calculamos el total de objetos que ya tiene el usuario en la mochila (igual que en agregarObjeto)
            $totalActual = Mochila::where('user_id', $usuario->id)->sum('amount');

            // Calculamos cuántas xuxes se pueden añadir sin superar el límite de la mochila
            $espacioDisponible = $maxMochila - $totalActual;
            $amountReal = min($cantidadTotal, $espacioDisponible);

            // Si no hay espacio, pasamos al siguiente usuario
            if ($amountReal <= 0) {
                continue;
            }

            // Repartimos las xuxes respetando el maxStack de 5
            while ($amountReal > 0) {
                // Calculamos cuántas añadimos en esta iteración (máximo 5 por stack)
                $amountIteracion = min($amountReal, $maxStack);

                // Buscamos si ya tiene un stack de xuxe_diaria con hueco (igual que en agregarObjeto)
                $xuxe = Mochila::where('user_id', $usuario->id)
                    ->where('name', 'xuxe_diaria')
                    ->where('type', 'xuxe')
                    ->where('amount', '<', $maxStack)
                    ->first();

                // Si se puede apilar
                if ($xuxe) {
                    $nuevoAmount = $xuxe->amount + $amountIteracion;

                    // Si el nuevo amount es menor o igual al máximo, se actualiza el stack actual
                    if ($nuevoAmount <= $maxStack) {
                        $xuxe->update([
                            'amount' => $nuevoAmount
                        ]);

                        // Si el nuevo amount supera el máximo, se llena el stack actual y el sobrante se procesa en la siguiente iteración
                    } else {
                        $sobrante = $nuevoAmount - $maxStack;

                        $xuxe->update([
                            'amount' => $maxStack
                        ]);

                        // Restamos solo lo que hemos podido meter en este stack
                        $amountIteracion = $amountIteracion - $sobrante;
                    }

                    // Si no se puede apilar, creamos un nuevo stack
                } else {
                    $xuxe = Mochila::create([
                        'type' => 'xuxe',
                        'name' => 'xuxe_diaria',
                        'amount' => $amountIteracion,
                        'stackable' => 1,
                        'user_id' => $usuario->id
                    ]);
                }

                $amountReal -= $amountIteracion;
            }
        }

        // Guardamos la fecha de hoy para no volver a repartir hasta mañana
        $config->update(['ultima_entrega' => now()->toDateString()]);
    }
}
