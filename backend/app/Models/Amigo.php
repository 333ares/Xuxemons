<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amigo extends Model
{
    protected $table = 'amigos';

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'status',
    ];

    /**
     * Usuario que envía la solicitud de amistad
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Usuario que recibe la solicitud de amistad
     */
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
