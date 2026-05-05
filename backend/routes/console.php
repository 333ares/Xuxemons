<?php

use App\Models\ConfigXuxes;
use App\Models\ConfigXuxemon;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Log;

// Se ejecuta cada minuto y verifica si es la hora de entregar los Xuxes del día
Schedule::call(function () {
    $config = ConfigXuxes::first();
    // Obtener la hora configurada para la entrega diaria
    $horaConfig = now()->setTimeFromTimeString($config->hora);
    $horaActual = now();

    // Verificar si la hora actual ha llegado y si aún no se ha hecho la entrega hoy
    if (
        $horaActual->gte($horaConfig) &&
        $config->ultima_entrega !== now()->toDateString()
    ) {
        // Disparar el job de reparto de Xuxes 
        \App\Jobs\RepartirXuxesDiarias::dispatchSync();
    }
})->everyMinute();

Schedule::call(function () {
    $config = ConfigXuxemon::first();
    // Obtener la hora configurada para la entrega diaria del Xuxemon
    $horaConfig = now()->setTimeFromTimeString($config->hora);
    $horaActual = now();

    // Verificar si la hora actual ha llegado y si aún no se ha hecho la entrega hoy
    if (
        $horaActual->gte($horaConfig) &&
        $config->ultima_entrega !== now()->toDateString()
    ) {
        // Disparar el job de reparto de Xuxemon 
        \App\Jobs\RepartirXuxemonDiario::dispatchSync();
    }
})->everyMinute();
