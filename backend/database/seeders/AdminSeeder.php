<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        if (!User::where('email', 'admin@gmail.com')->exists()) {
            User::create([
                'public_id' => '#Admin0001',
                'name'      => 'Admin',
                'surname'   => 'Admin',
                'email'     => 'admin@gmail.com',
                'password'  => Hash::make('12345678'),
            ]);
        }
    }
}
