<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UsersExport implements FromCollection,WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return User::with('departement')
            ->get()
            ->map(function ($e) {
                return [
                    'nom' => $e->name,
                    'prenom' => $e->prenom,
                    'cin'=> $e->cin,
                    'rib'=> $e->rib,
                    'email' => $e->email,
                    'password' => $e->password,
                    'picture' => $e->picture,
                    'telephone' => $e->tel,
                    'adresse' => $e->adresse,
                    'dateNaissance' => $e->date_naissance,
                    'situationFamiliale' => $e->situationFamiliale,
                    'nbreEnfants' => $e->nbEnfants,
                    'departement' => optional($e->departement)->nom,
                    'role' => $e->role,
                    'statut' => $e->statut,
                    'typeContrat' => $e->typeContrat,
                ];
            });
    }

    public function headings(): array
    {
        return ['Nom', 'Prénom',"Carte Nationale d'identité",'RIB bancaire', 'Email','Mot de Passe','Photo de Profil','Télephone','Adresse','Date de Naissance','situation Familiale','Nombre des Enfants', 'Département', 'Rôle', 'Statut', 'Type Contrat'];
    }

}
