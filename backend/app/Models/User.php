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
        'password'
    ];

    /**
     * Campos ocultos al serializar.
     */
    protected $hidden = [
        'password',
    ];

    public function getIdAttribute($value)
    {
        // str_pad(variable, largo, con_que_rellenar, donde_rellenar)
        return str_pad($value, 4, '0', STR_PAD_LEFT);
    }
}
