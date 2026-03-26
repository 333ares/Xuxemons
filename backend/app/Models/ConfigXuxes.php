<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfigXuxes extends Model
{
    protected $fillable = [
        'cantidad',
        'hora',
        'ultima_entrega'
    ];

    protected $table = 'config_xuxes';
}
