 <?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('config_alimentar', function (Blueprint $table) {
            $table->id();
            $table->integer('porcentaje_bajon')->default(5);
            $table->integer('porcentaje_sobredosis')->default(10);
            $table->integer('porcentaje_atracon')->default(15);
            $table->integer('xuxes_s_a_m')->default(3);
            $table->integer('xuxes_m_a_g')->default(5);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('config_alimentar');
    }
}; 