<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class EmployeSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('fr_FR');

        $roles = ['Employe', 'Chef_Dep', 'RH'];
        $situations = ['Célibataire', 'Marié', 'Divorcé'];
        $typesContrat = ['Permanent', 'Temporaire'];
        $statuts = ['Actif', 'Inactif', 'Congé', 'Malade'];
        $departementIds = \App\Models\Departement::pluck('id')->toArray(); // Assure-toi que des départements existent

        for ($i = 0; $i < 10; $i++) {
            User::create([
                'name' => $faker->lastName,
                'prenom' => $faker->firstName,
                'cin' => strtoupper($faker->bothify('??######')),
                'rib' => $faker->bankAccountNumber,
                'situationFamiliale' => $faker->randomElement($situations),
                'nbEnfants' => $faker->numberBetween(0, 5),
                'adresse' => $faker->address,
                'tel' => $faker->phoneNumber,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password'), // mot de passe simple
                'role' => $faker->randomElement($roles),
                'typeContrat' => $faker->randomElement($typesContrat),
                'date_naissance' => $faker->date('Y-m-d', '-20 years'),
                'statut' => $faker->randomElement($statuts),
                'departement_id' => $faker->randomElement($departementIds),
                'picture' => null, // Tu peux ajouter un faux fichier si nécessaire
            ]);
        }
    }
}
