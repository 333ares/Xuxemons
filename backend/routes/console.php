<?php

use App\Models\ConfigXuxes;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Log;

Schedule::call(function () {
    $config = ConfigXuxes::first();
    $horaConfig = $config->hora;
    $horaActual = now()->format('H:i');

    Log::info('Scheduler check', [
        'hora_actual' => $horaActual,
        'hora_config' => $horaConfig,
        'ultima_entrega' => $config->ultima_entrega
    ]);

    if (
        $horaActual >= $horaConfig &&
        $config->ultima_entrega !== now()->toDateString()
    ) {
        Log::info('DISPATCH JOB');
        \App\Jobs\RepartirXuxesDiarias::dispatchSync();
    }
})->everyMinute();
