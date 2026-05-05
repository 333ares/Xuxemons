<?php

namespace Database\Seeders;

use App\Models\Amigo;
use App\Models\Batalla;
use App\Models\Message;
use App\Models\Mochila;
use App\Models\User;
use App\Models\Xuxemons;
use App\Models\XuxemonsInfo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Crear 10 usuarios de prueba
        $usersData = [
            ['public_id' => '#TEST0002', 'name' => 'Arnau', 'surname' => 'Puig', 'email' => 'arnau@test.com'],
            ['public_id' => '#TEST0003', 'name' => 'Marta', 'surname' => 'Soler', 'email' => 'marta@test.com'],
            ['public_id' => '#TEST0004', 'name' => 'Pol', 'surname' => 'Ferrer', 'email' => 'pol@test.com'],
            ['public_id' => '#TEST0005', 'name' => 'Laia', 'surname' => 'Camps', 'email' => 'laia@test.com'],
            ['public_id' => '#TEST0006', 'name' => 'Jordi', 'surname' => 'Vila', 'email' => 'jordi@test.com'],
            ['public_id' => '#TEST0007', 'name' => 'Núria', 'surname' => 'Mas', 'email' => 'nuria@test.com'],
            ['public_id' => '#TEST0008', 'name' => 'Marc', 'surname' => 'Pons', 'email' => 'marc@test.com'],
            ['public_id' => '#TEST0009', 'name' => 'Carla', 'surname' => 'Roca', 'email' => 'carla@test.com'],
            ['public_id' => '#TEST0010', 'name' => 'Biel', 'surname' => 'Compte', 'email' => 'biel@test.com'],
            ['public_id' => '#TEST0011', 'name' => 'Júlia', 'surname' => 'Esteve', 'email' => 'julia@test.com'],
        ];

        $users = [];
        foreach ($usersData as $data) {
            $users[] = User::firstOrCreate(
                ['email' => $data['email']],
                array_merge($data, ['password' => Hash::make('12345678')])
            );
        }

        // 2. Obtener nombres de xuxemons disponibles
        $xuxemons = XuxemonsInfo::all()->keyBy('name');

        // Helper: crea un xuxemon para un usuario
        $makeXuxemon = function (User $user, string $name, string $size, ?string $sickness = null) use ($xuxemons) {
            $info = $xuxemons->get($name);
            if (!$info) return;
            Xuxemons::create([
                'name'        => $name,
                'type'        => $info->type,
                'size'        => $size,
                'sickness'    => $sickness,
                'xuxes_count' => 0,
                'user_id'     => $user->id,
            ]);
        };

        // 3. Asignar xuxemons a cada usuario
        $makeXuxemon($users[0], 'Tux', 'm');
        $makeXuxemon($users[0], 'Meekmeek', 's');
        $makeXuxemon($users[1], 'Dolly', 'g');

        $makeXuxemon($users[1], 'Ladybug', 's');
        $makeXuxemon($users[1], 'Mocha', 'm');
        $makeXuxemon($users[1], 'Beeboo', 's');
        $makeXuxemon($users[1], 'Dolly', 'g');

        $makeXuxemon($users[2], 'Tux', 'm');
        $makeXuxemon($users[2], 'Chopper', 's');

        $makeXuxemon($users[3], 'Flipper', 'g');
        $makeXuxemon($users[3], 'Posón', 'm');
        $makeXuxemon($users[3], 'Rajoy', 's');

        $makeXuxemon($users[4], 'Ron', 'g');
        $makeXuxemon($users[4], 'Meekmeek', 's');
        $makeXuxemon($users[4], 'Megalo', 'm');

        $makeXuxemon($users[5], 'Chapapá', 's');
        $makeXuxemon($users[5], 'Avecrem', 'm');

        $makeXuxemon($users[6], 'Deskangoo', 'g');
        $makeXuxemon($users[6], 'Pollis', 's');
        $makeXuxemon($users[6], 'Oreo', 'm');

        $makeXuxemon($users[7], 'Shelly', 's');
        $makeXuxemon($users[7], 'Catua', 'm');
        $makeXuxemon($users[7], 'Bambino', 'g');
        $makeXuxemon($users[7], 'Quakko', 's');

        $makeXuxemon($users[8], 'Otto', 'm');
        $makeXuxemon($users[8], 'Torcas', 's');

        $makeXuxemon($users[9], 'Murcimurci', 'g');
        $makeXuxemon($users[9], 'Apleki', 's');
        $makeXuxemon($users[9], 'Eldientes', 'm');

        // 4. Mochila
        $items = [
            ['type' => 'xuxe', 'name' => 'algodon', 'stackable' => true, 'amount' => 3],
            ['type' => 'xuxe', 'name' => 'caramelo', 'stackable' => true, 'amount' => 2],
            ['type' => 'vacuna', 'name' => 'inxulina', 'stackable' => false, 'amount' => 1],
            ['type' => 'vacuna', 'name' => 'macedonia', 'stackable' => false, 'amount' => 1],
        ];

        foreach ($users as $i => $user) {
            // Cada usuario recibe entre 2 y 4 tipos de ítems
            $userItems = array_slice($items, 0, rand(2, 4));
            foreach ($userItems as $item) {
                Mochila::create(array_merge($item, ['user_id' => $user->id]));
            }
        }

        // 5. Amistades
        // Pares aceptados
        $accepted = [
            [1, 3],
            [2, 4],
            [3, 5],
            [4, 6],
            [5, 7],
            [6, 8],
            [7, 9],
        ];
        foreach ($accepted as [$a, $b]) {
            Amigo::firstOrCreate(
                ['sender_id' => $users[$a]->id, 'receiver_id' => $users[$b]->id],
                ['status' => 'accepted']
            );
        }

        // Solicitudes pendientes
        $pending = [[1, 5], [1, 6], [2, 7]];
        foreach ($pending as [$a, $b]) {
            Amigo::firstOrCreate(
                ['sender_id' => $users[$a]->id, 'receiver_id' => $users[$b]->id],
                ['status' => 'pending']
            );
        }

        // 6. Batallas
        $batallas = [
            [1, 2, 'accepted'],
            [3, 4, 'pending'],
            [5, 6, 'accepted'],
            [7, 8, 'accepted'],
            [9, 8, 'pending'],
        ];
        foreach ($batallas as [$a, $b, $status]) {
            Batalla::firstOrCreate(
                ['sender_id' => $users[$a]->id, 'receiver_id' => $users[$b]->id],
                ['status' => $status]
            );
        }

        // 7. Mensajes
        $conversations = [
            [1, 2, [
                ['sender' => 1, 'content' => 'Ei, has visto que mi xuxemon ha subido de nivel?'],
                ['sender' => 2, 'content' => 'Si! El mío aún esta malo...'],
                ['sender' => 1, 'content' => 'Le has dado la vacuna?'],
                ['sender' => 2, 'content' => 'Aún no!'],
            ]],
            [2, 4, [
                ['sender' => 2, 'content' => 'Batalla?'],
                ['sender' => 4, 'content' => 'Hecho!'],
            ]],
            [5, 7, [
                ['sender' => 5, 'content' => 'Hola, que tal?'],
                ['sender' => 7, 'content' => 'Yo bien, tu que tal?'],
                ['sender' => 5, 'content' => 'Genial, gracias!'],
            ]],
        ];

        foreach ($conversations as [$a, $b, $msgs]) {
            foreach ($msgs as $msg) {
                $senderIdx  = $msg['sender'];
                $receiverIdx = ($senderIdx === $a) ? $b : $a;
                Message::create([
                    'sender_id'   => $users[$senderIdx]->id,
                    'receiver_id' => $users[$receiverIdx]->id,
                    'content'     => $msg['content'],
                    'read_at'     => rand(0, 1) ? now() : null,
                ]);
            }
        }
    }
}
