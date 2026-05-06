<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\XuxemonsInfo;

class XuxemonsInfoSeeder extends Seeder
{
    public function run(): void
    {
        $xuxemons = [
            ['name' => 'Apleki', 'type' => 'Tierra'],
            ['name' => 'Avecrem', 'type' => 'Aire'],
            ['name' => 'Bambino', 'type' => 'Tierra'],
            ['name' => 'Beeboo', 'type' => 'Aire'],
            ['name' => 'Boo-hoot', 'type' => 'Aire'],
            ['name' => 'Cabrales', 'type' => 'Tierra'],
            ['name' => 'Catua', 'type' => 'Aire'],
            ['name' => 'Catyuska', 'type' => 'Aire'],
            ['name' => 'Chapapá', 'type' => 'Agua'],

            ['name' => 'Chopper', 'type' => 'Tierra'],
            ['name' => 'Cuellilargui', 'type' => 'Tierra'],
            ['name' => 'Deskangoo', 'type' => 'Tierra'],
            ['name' => 'Doflamingo', 'type' => 'Aire'],
            ['name' => 'Dolly', 'type' => 'Tierra'],
            ['name' => 'Elconchudo', 'type' => 'Agua'],
            ['name' => 'Eldientes', 'type' => 'Agua'],
            ['name' => 'Elgominas', 'type' => 'Tierra'],
            ['name' => 'Flipper', 'type' => 'Agua'],
            ['name' => 'Floppi', 'type' => 'Tierra'],

            ['name' => 'Horseluis', 'type' => 'Agua'],
            ['name' => 'Krokolisko', 'type' => 'Agua'],
            ['name' => 'Kurama', 'type' => 'Tierra'],
            ['name' => 'Ladybug', 'type' => 'Aire'],
            ['name' => 'Lengualargui', 'type' => 'Tierra'],
            ['name' => 'Medusation', 'type' => 'Agua'],
            ['name' => 'Meekmeek', 'type' => 'Tierra'],
            ['name' => 'Megalo', 'type' => 'Agua'],
            ['name' => 'Mocha', 'type' => 'Agua'],
            ['name' => 'Murcimurci', 'type' => 'Aire'],

            ['name' => 'Nemo', 'type' => 'Agua'],
            ['name' => 'Oinkcelot', 'type' => 'Tierra'],
            ['name' => 'Oreo', 'type' => 'Tierra'],
            ['name' => 'Otto', 'type' => 'Tierra'],
            ['name' => 'Pinchimott', 'type' => 'Agua'],
            ['name' => 'Pollis', 'type' => 'Aire'],
            ['name' => 'Posón', 'type' => 'Aire'],
            ['name' => 'Quakko', 'type' => 'Agua'],
            ['name' => 'Rajoy', 'type' => 'Aire'],
            ['name' => 'Rawlion', 'type' => 'Tierra'],

            ['name' => 'Rexxo', 'type' => 'Tierra'],
            ['name' => 'Ron', 'type' => 'Tierra'],
            ['name' => 'Sesssi', 'type' => 'Tierra'],
            ['name' => 'Shelly', 'type' => 'Agua'],
            ['name' => 'Sirucco', 'type' => 'Aire'],
            ['name' => 'Torcas', 'type' => 'Agua'],
            ['name' => 'Trompeta', 'type' => 'Aire'],
            ['name' => 'Trompi', 'type' => 'Tierra'],
            ['name' => 'Tux', 'type' => 'Agua'],
        ];

        foreach ($xuxemons as $x) {
            XuxemonsInfo::firstOrCreate(['name' => $x['name']], $x);
        }
    }
}
