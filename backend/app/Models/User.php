<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Campos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'public_id',
        'name',
        'surname',
        'email',
        'password',
    ];

    /**
     * Campos ocultos al serializar.
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Casts de atributos.
     */
    protected function casts(): array
    {
        return [
        ];
    }
}
