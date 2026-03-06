<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Xuxemon extends Model
{
    protected $fillable = [
        'name',
        'type',
        'size',
        'sickness',
        'user_id'
    ];

    protected $attributes = [
        'size' => 'small',
        'sickness' => 'false'
    ];
}

