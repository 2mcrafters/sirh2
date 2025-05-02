<?php

namespace App\Exports;

use App\Models\Pointage;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PointagesExport implements FromCollection,WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Pointage::with('user')
            ->get()
            ->map(function ($item) {
                $nom = $item->user->name ?? '';
                $prenom = $item->user->prenom ?? '';
                $nomComplet = trim("$prenom $nom");
                return [
                   'Nom Complet Employé' => $nomComplet ?: 'N/A',
                    'Date' => $item->date,
                    'Heure Entrée' => $item->heureEntree,
                    'Heure Sortie' => $item->heureSortie,
                    'Statut Jour' => $item->statutJour,
                    'Heures Supplémentaires' => $item->overtimeHours,
                ];
            });
    }

    public function headings(): array
    {
        return ['Nom Complet Employé', 'Date', 'Heure Entrée', 'Heure Sortie', 'Statut Jour', 'Heures Supplémentaires'];
    }
}
