<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfigXuxemon extends Model
{
    protected $table = 'config_xuxemon';

    protected $fillable = [
        'hora',
        'ultima_entrega'
    ];
}
