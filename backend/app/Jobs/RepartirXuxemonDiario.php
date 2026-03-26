<?php

namespace App\Jobs;

use App\Models\Xuxemons;
use App\Models\XuxemonsInfo;
use App\Models\User;
use App\Models\ConfigXuxemon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RepartirXuxemonDiario implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $config = ConfigXuxemon::first();

        // Comprobamos que no se haya repartido ya hoy
        if ($config->ultima_entrega === now()->toDateString()) {
            return;
        }

        // Randomizamos un xuxemon del 1 al 48 (el mismo para todos los usuarios ese día)
        $xuxemon_id = random_int(1, 48);
        $xuxemonInfo = XuxemonsInfo::find($xuxemon_id);

        if (!$xuxemonInfo) {
            return;
        }

        $usuarios = User::all();

        foreach ($usuarios as $usuario) {
            Xuxemons::create([
                'name'       => $xuxemonInfo->name,
                'type'       => $xuxemonInfo->type,
                'size'       => 's',
                'sickness'   => null,
                'xuxes_count' => 0,
                'user_id'    => $usuario->id
            ]);
        }

        // Guardamos la fecha de hoy para no volver a repartir hasta mañana
        $config->update(['ultima_entrega' => now()->toDateString()]);
    }
}
