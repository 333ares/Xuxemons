<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ConfigAlimentar;

class ConfigAlimentarSeeder extends Seeder
{
    public function run(): void
    {
        if (!ConfigAlimentar::exists()) {
            ConfigAlimentar::create([
                'porcentaje_bajon'      => 5,
                'porcentaje_sobredosis' => 10,
                'porcentaje_atracon'    => 15,
                'xuxes_s_a_m'          => 3,
                'xuxes_m_a_g'          => 5
            ]);
        }
    }
}