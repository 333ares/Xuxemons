<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfigAlimentar extends Model
{
    protected $table = 'config_alimentar';

    protected $fillable = [
        'porcentaje_bajon',
        'porcentaje_sobredosis',
        'porcentaje_atracon',
        'xuxes_s_a_m',
        'xuxes_m_a_g'
    ];
}