<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mochila extends Model
{
    protected $fillable = [
        'name',
        'stackable',
        'amount',
        'user_id'
    ];
}
