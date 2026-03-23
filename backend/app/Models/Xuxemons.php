<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Xuxemons extends Model
{
    protected $fillable = [
        'name',
        'type',
        'size',
        'sickness',
        'xuxes_count',
        'user_id'
    ];

    protected $attributes = [
        'size' => 's',
        'sickness' => null
    ];
}
