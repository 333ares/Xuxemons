<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ConfigXuxemon;

class ConfigXuxemonSeeder extends Seeder
{
    public function run(): void
    {
        if (!ConfigXuxemon::exists()) {
            ConfigXuxemon::create([
                'hora' => '08:00',
                'ultima_entrega' => null
            ]);
        }
    }
}
