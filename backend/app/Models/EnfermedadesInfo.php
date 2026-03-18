<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnfermedadesInfo extends Model
{
    protected $table = 'enfermedades_info';

    protected $fillable = [
        'name',
        'description',
    ];
}
