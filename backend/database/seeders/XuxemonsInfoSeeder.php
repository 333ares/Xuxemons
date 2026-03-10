<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\XuxemonInfo;

class XuxemonsInfoSeeder extends Seeder
{
    public function run(): void
    {
        $xuxemons = [
            ['nombre' => 'Apleki', 'tipo' => 'Tierra'],
            ['nombre' => 'Avecrem', 'tipo' => 'Aire'],
            ['nombre' => 'Bambino', 'tipo' => 'Tierra'],
            ['nombre' => 'Beeboo', 'tipo' => 'Aire'],
            ['nombre' => 'Boo-hoot', 'tipo' => 'Aire'],
            ['nombre' => 'Cabrales', 'tipo' => 'Tierra'],
            ['nombre' => 'Catua', 'tipo' => 'Aire'],
            ['nombre' => 'Catyuska', 'tipo' => 'Aire'],
            ['nombre' => 'Chapapá', 'tipo' => 'Agua'],

            ['nombre' => 'Chopper', 'tipo' => 'Tierra'],
            ['nombre' => 'Cuellilargui', 'tipo' => 'Tierra'],
            ['nombre' => 'Deskangoo', 'tipo' => 'Tierra'],
            ['nombre' => 'Doflamingo', 'tipo' => 'Aire'],
            ['nombre' => 'Dolly', 'tipo' => 'Tierra'],
            ['nombre' => 'Elconchudo', 'tipo' => 'Agua'],
            ['nombre' => 'Eldientes', 'tipo' => 'Agua'],
            ['nombre' => 'Elgominas', 'tipo' => 'Tierra'],
            ['nombre' => 'Flipper', 'tipo' => 'Agua'],
            ['nombre' => 'Floppi', 'tipo' => 'Tierra'],

            ['nombre' => 'Horseluis', 'tipo' => 'Agua'],
            ['nombre' => 'Krokolisko', 'tipo' => 'Agua'],
            ['nombre' => 'Kurama', 'tipo' => 'Tierra'],
            ['nombre' => 'Ladybug', 'tipo' => 'Aire'],
            ['nombre' => 'Lengualargui', 'tipo' => 'Tierra'],
            ['nombre' => 'Medusation', 'tipo' => 'Agua'],
            ['nombre' => 'Meekmeek', 'tipo' => 'Tierra'],
            ['nombre' => 'Megalo', 'tipo' => 'Agua'],
            ['nombre' => 'Mocha', 'tipo' => 'Agua'],
            ['nombre' => 'Murcimurci', 'tipo' => 'Aire'],

            ['nombre' => 'Nemo', 'tipo' => 'Agua'],
            ['nombre' => 'Oinkcelot', 'tipo' => 'Tierra'],
            ['nombre' => 'Oreo', 'tipo' => 'Tierra'],
            ['nombre' => 'Otto', 'tipo' => 'Tierra'],
            ['nombre' => 'Pinchimott', 'tipo' => 'Agua'],
            ['nombre' => 'Pollis', 'tipo' => 'Aire'],
            ['nombre' => 'Posón', 'tipo' => 'Aire'],
            ['nombre' => 'Quakko', 'tipo' => 'Agua'],
            ['nombre' => 'Rajoy', 'tipo' => 'Aire'],
            ['nombre' => 'Rawlion', 'tipo' => 'Tierra'],

            ['nombre' => 'Rexxo', 'tipo' => 'Tierra'],
            ['nombre' => 'Ron', 'tipo' => 'Tierra'],
            ['nombre' => 'Sesssi', 'tipo' => 'Tierra'],
            ['nombre' => 'Shelly', 'tipo' => 'Agua'],
            ['nombre' => 'Sirucco', 'tipo' => 'Aire'],
            ['nombre' => 'Torcas', 'tipo' => 'Agua'],
            ['nombre' => 'Trompeta', 'tipo' => 'Aire'],
            ['nombre' => 'Trompi', 'tipo' => 'Tierra'],
            ['nombre' => 'Tux', 'tipo' => 'Agua'],
        ];

        foreach ($xuxemons as $x) {
            XuxemonInfo::create($x);
        }
    }
}

