<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Departement;

class DepartementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Departement::insert([
            ['nom' => 'Ressources Humaines', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Informatique', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Comptabilité', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Marketing', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Production', 'created_at' => now(), 'updated_at' => now()],
        ]);  
    }
}
