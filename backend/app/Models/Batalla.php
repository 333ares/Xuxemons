<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Batalla extends Model
{
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'status',
    ];

    // Relación con el usuario que envía el reto
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    // Relación con el usuario que recibe el reto
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
