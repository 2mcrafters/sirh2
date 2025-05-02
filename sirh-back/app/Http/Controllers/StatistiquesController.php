<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Pointage;
use Illuminate\Support\Facades\Log;

class StatistiquesController extends Controller
{
    public function statistiquesPresence(Request $request)
    {
        try {
            $user = auth()->user(); 
            $periode = $request->get('periode', 'jour');
    
            // Log des paramètres
            \Log::info('Paramètres reçus:', [
                'periode' => $periode,
                'date' => $request->get('date'),
                'dateDebut' => $request->get('dateDebut'),
                'dateFin' => $request->get('dateFin'),
                'mois' => $request->get('mois')
            ]);
    
            // Déterminer la période
            switch ($periode) {
                case 'semaine':
                    $dateDebut = Carbon::parse($request->get('dateDebut'));
                    $dateFin = Carbon::parse($request->get('dateFin'));
                    $start = $dateDebut->startOfDay();
                    $end = $dateFin->endOfDay();
                    break;
                case 'mois':
                    $mois = Carbon::parse($request->get('mois'));
                    $start = $mois->copy()->startOfMonth();
                    $end = $mois->copy()->endOfMonth();
                    break;
                default: // jour
                    $date = Carbon::parse($request->get('date'));
                    $start = $date->copy()->startOfDay();
                    $end = $date->copy()->endOfDay();
                    break;
            }
    
            // Déterminer les employés concernés
            if ($user->hasRole('RH')) {
                $employes = User::all();
            } elseif ($user->hasRole('Chef_Dep')) {
                $employes = User::where('departement_id', $user->departement_id)->get();
            } elseif ($user->hasRole('Employe')) {
                $employes = collect([$user]);
            } else {
                return response()->json(['message' => 'Non autorisé'], 403);
            }
    
            $userIds = $employes->pluck('id');
    
            // Récupérer les pointages
            $pointages = Pointage::whereBetween('date', [$start, $end])
                ->whereIn('user_id', $userIds)
                ->get();
    
            $present = $pointages->where('statutJour', 'present')->count();
            $absent = $pointages->where('statutJour', 'absent')->count();
            $enRetard = $pointages->where('statutJour', 'retard')->count();
    
            $totalUsers = $employes->count();
    
            $presentPercentage = $totalUsers ? number_format(($present / $totalUsers) * 100, 2) : 0;
            $absentPercentage = $totalUsers ? number_format(($absent / $totalUsers) * 100, 2) : 0;
            $enRetardPercentage = $totalUsers ? number_format(($enRetard / $totalUsers) * 100, 2) : 0;
    
            return response()->json([
                'role' => $user->getRoleNames()->first(), // ← ajout du rôle ici
                'periode' => $periode,
                'date' => $start->toDateString(),
                'dateDebut' => $periode === 'semaine' ? $dateDebut->toDateString() : null,
                'dateFin' => $periode === 'semaine' ? $dateFin->toDateString() : null,
                'mois' => $periode === 'mois' ? $mois->format('Y-m') : null,
                'total_employes' => $totalUsers,
                'present' => $present,
                'absent' => $absent,
                'en_retard' => $enRetard,
                'pourcentage_present' => $presentPercentage,
                'pourcentage_absent' => $absentPercentage,
                'pourcentage_en_retard' => $enRetardPercentage,
            ]);
    
        } catch (\Exception $e) {
            \Log::error('Erreur dans statistiquesPresence:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Une erreur est survenue lors du traitement des statistiques'], 500);
        }
    }
    
}
