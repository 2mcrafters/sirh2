<?php

namespace Database\Seeders;

use App\Models\Societe;
use Illuminate\Database\Seeder;

class SocieteSeeder extends Seeder
{
    public function run(): void
    {
        $societes = [
            ['nom' => 'Société A'],
            ['nom' => 'Société B'],
            ['nom' => 'Société C'],
        ];

        foreach ($societes as $societe) {
            Societe::create($societe);
        }
    }
}