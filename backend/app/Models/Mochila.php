<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mochila extends Model
{
    protected $fillable = [
        'nombre_xuxe',
        'apilable',
        'cantidad',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Saber si el espacio está lleno para apilables
    public function espacioLleno()
    {
        return $this->apilable && $this->cantidad >= 5;
    }
}
