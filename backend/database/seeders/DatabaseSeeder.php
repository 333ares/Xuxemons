<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            XuxemonsInfoSeeder::class,
        ]);

        $this->call([
            ConfigXuxemonSeeder::class,
        ]);

        $this->call([
            ConfigXuxesSeeder::class,
        ]);

        $this->call([
            ConfigAlimentarSeeder::class,
        ]);
        $this->call([
            AdminSeeder::class,
        ]);
    }
}
