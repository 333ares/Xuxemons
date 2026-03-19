<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EnfermedadesInfoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('enfermedades_info')->insert([
            [
                'id' => 1,
                'name' => 'Bajón de azúcar',
                'description' => 'Requiere +2 xuxes por nivel para crecer.',
            ],
            [
                'id' => 2,
                'name' => 'Atracón',
                'description' => 'El xuxemon no puede alimentarse, por lo tanto el usuario no puede darle comida.',
            ],
        ]);
    }
}
