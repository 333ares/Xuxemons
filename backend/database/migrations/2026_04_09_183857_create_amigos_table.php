<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('amigos', function (Blueprint $table) {
            $table->id();

            // Usuario que envía la solicitud
            $table->foreignId('sender_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // Usuario que recibe la solicitud
            $table->foreignId('receiver_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // Estado de la amistad
            $table->enum('status', ['pending', 'accepted', 'rejected'])
                  ->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('amigos');
    }
};
