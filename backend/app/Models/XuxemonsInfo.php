<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class XuxemonsInfo extends Model
{
    protected $table = 'xuxemons_info';

    protected $fillable = [
        'id',
        'name',
        'type'
    ];
}

