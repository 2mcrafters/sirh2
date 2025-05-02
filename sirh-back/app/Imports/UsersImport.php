<?php

namespace App\Imports;

use App\Models\User;

use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Models\Departement;

class UsersImport implements ToModel,WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        
        $nomDepartement = trim($row['nom_departement']);  

        
        $departement = Departement::firstOrCreate([
            'nom' => $nomDepartement,
        ]);

        
        return new User([
            'cin' => $row["cin"],                     
            'rib' => $row['rib'],             
            'situationFamiliale' => $row['situation_familiale'],
            'nbEnfants' => $row['nombre_enfants'],
            'adresse' => $row['adresse'],
            'name' => $row['nom'],   
            'password' => bcrypt($row['mot_de_passe']),
            'picture' => $row['photo_profil'],                 
            'prenom' => $row['prenom'],               
            'date_naissance' => $row['date_naissance'], 
            'tel' => $row['telephone'],             
            'email' => $row['email'],                 
            'role' => $row['role'],                   
            'statut' => $row['statut'],               
            'typeContrat' => $row['type_contrat'],     
            'departement_id' => $departement->id,     
        ]);
    }
}
