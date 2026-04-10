<?php

use App\Models\ConfigXuxes;
use App\Models\ConfigXuxemon;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Log;

Schedule::call(function () {
    $config = ConfigXuxes::first();
    $horaConfig = now()->setTimeFromTimeString($config->hora);
    $horaActual = now();

    if (
        $horaActual->gte($horaConfig) &&
        $config->ultima_entrega !== now()->toDateString()
    ) {
        \App\Jobs\RepartirXuxesDiarias::dispatchSync();
    }
})->everyMinute();

Schedule::call(function () {
    $config = ConfigXuxemon::first();
    $horaConfig = now()->setTimeFromTimeString($config->hora);
    $horaActual = now();

    if (
        $horaActual->gte($horaConfig) &&
        $config->ultima_entrega !== now()->toDateString()
    ) {
        \App\Jobs\RepartirXuxemonDiario::dispatchSync();
    }
})->everyMinute();
