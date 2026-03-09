<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('xuxemon_infos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->enum('tipo', ['Agua', 'Tierra', 'Aire']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('xuxemon_infos');
    }
};
