<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class XuxemonInfo extends Model
{
    protected $table = 'xuxemons_info';

    protected $fillable = [
        'nombre',
        'tipo'
    ];
}

