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

        $maxMochila = 20;
        $maxStack = 5;

        $nombresXuxes = [
            'algodon',
            'caramelo',
            'caramelos',
            'chocolate',
            'lolly',
            'macedonia',
            'navidad',
            'ovalados',
            'piruleta',
            'redondeos',
            'suggus'
        ];

        // Mezclamos y cogemos solo la cantidad configurada por el admin
        shuffle($nombresXuxes);
        $seleccionadas = array_slice($nombresXuxes, 0, $config->cantidad);

        $usuarios = User::all();

        foreach ($usuarios as $usuario) {
            foreach ($seleccionadas as $nombre) {

                // Recalculamos espacio antes de cada xuxe
                $totalActual = Mochila::where('user_id', $usuario->id)->sum('amount');
                $espacioDisponible = $maxMochila - $totalActual;

                if ($espacioDisponible <= 0) break;

                // Buscamos stack existente con hueco
                $xuxe = Mochila::where('user_id', $usuario->id)
                    ->where('name', $nombre)
                    ->where('type', 'xuxe')
                    ->where('amount', '<', $maxStack)
                    ->first();

                if ($xuxe) {
                    $nuevoAmount = $xuxe->amount + 1;

                    if ($nuevoAmount <= $maxStack) {
                        $xuxe->update(['amount' => $nuevoAmount]);
                    } else {
                        $xuxe->update(['amount' => $maxStack]);
                        $sobrante = $nuevoAmount - $maxStack;

                        Mochila::create([
                            'type'      => 'xuxe',
                            'name'      => $nombre,
                            'amount'    => $sobrante,
                            'stackable' => 1,
                            'user_id'   => $usuario->id
                        ]);
                    }
                } else {
                    Mochila::create([
                        'type'      => 'xuxe',
                        'name'      => $nombre,
                        'amount'    => 1,
                        'stackable' => 1,
                        'user_id'   => $usuario->id
                    ]);
                }
            }
        }

        // Guardamos la fecha de hoy para no volver a repartir hasta mañana
        $config->update(['ultima_entrega' => now()->toDateString()]);
    }
}
