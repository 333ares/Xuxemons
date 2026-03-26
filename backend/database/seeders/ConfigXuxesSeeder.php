<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ConfigXuxes;

class ConfigXuxesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!ConfigXuxes::exists()) {
            ConfigXuxes::create([
                'cantidad' => 10,
                'hora' => '08:00',
                'ultima_entrega' => null
            ]);
        }
    }
}
