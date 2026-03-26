<?php

use App\Models\ConfigXuxes;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Log;

Schedule::call(function () {
    $config = ConfigXuxes::first();

    $horaConfig = \Carbon\Carbon::createFromFormat('H:i', $config->hora);
    $horaActual = now();

    Log::info('Scheduler check', [
        'hora_actual' => $horaActual->format('H:i'),
        'hora_config' => $config->hora,
        'ultima_entrega' => $config->ultima_entrega
    ]);

    if (
        $horaActual->gte($horaConfig) &&
        $config->ultima_entrega !== now()->toDateString()
    ) {
        Log::info('DISPATCH JOB');
        \App\Jobs\RepartirXuxesDiarias::dispatchSync();
    }
})->everyMinute();
