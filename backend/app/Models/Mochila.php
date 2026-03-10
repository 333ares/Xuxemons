<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mochila extends Model
{
    protected $fillable = [
        'id',
        'type',
        'name',
        'stackable',
        'amount',
        'user_id'
    ];
}
