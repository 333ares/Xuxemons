<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('batallas', function (Blueprint $table) {
            $table->id();
            // Usuario que envía el reto
            $table->foreignId('sender_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            // Usuario que recibe el reto
            $table->foreignId('receiver_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            // Estado del reto: pending / accepted / rejected
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('batallas');
    }
};
