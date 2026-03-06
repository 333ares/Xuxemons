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
        'user_id'
    ];

    protected $attributes = [
        'size' => 's',
        'sickness' => '0'
    ];
}

