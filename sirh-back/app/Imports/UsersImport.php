<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Departement;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterImport;

class UsersImport implements ToModel, WithHeadingRow, WithEvents
{
    protected $usersWithRoles = [];

    public function model(array $row)
    {
        $nomDepartement = trim($row['nom_departement']);  
        $departement = Departement::firstOrCreate([
            'nom' => $nomDepartement,
        ]);

        $user = new User([
            'cin' => $row["cin"],                     
            'rib' => $row['rib'],             
            'situationFamiliale' => $row['situation_familiale'],
            'nbEnfants' => $row['nombre_enfants'],
            'adresse' => $row['adresse'],
            'name' => $row['nom'],   
            'password' => Hash::make($row['mot_de_passe']),
            'picture' => $row['photo_profil'],                 
            'prenom' => $row['prenom'],               
            'date_naissance' => $row['date_naissance'], 
            'tel' => $row['telephone'],             
            'email' => $row['email'],                 
            'statut' => $row['statut'],               
            'typeContrat' => $row['type_contrat'],     
            'role' => $row['role'],
            'departement_id' => $departement->id,     
        ]);

        // Stock temporairement l'info du rôle avec le user (à assigner après)
        $this->usersWithRoles[] = [
            'user' => $user,
            'role' => $row['role']
        ];

        return $user;
    }

    public function registerEvents(): array
    {
        return [
            AfterImport::class => function (AfterImport $event) {
                foreach ($this->usersWithRoles as $userData) {
                    $user = User::where('email', $userData['user']->email)->first();
                    if ($user && !empty($userData['role'])) {
                        $user->assignRole($userData['role']);
                    }
                }
            },
        ];
    }
}
