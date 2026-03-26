<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('config_xuxes', function (Blueprint $table) {
            $table->id();
            $table->integer('cantidad')->default(10);
            $table->string('hora')->default('08:00'); // Formato HH:MM
            $table->date('ultima_entrega')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('config_xuxes');
    }
};
