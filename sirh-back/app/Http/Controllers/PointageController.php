<?php

namespace App\Http\Controllers;

use App\Models\Pointage;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class PointageController extends Controller
{
  
        public function index()
        {
            $user = auth()->user();
    
            if ($user->hasRole('RH')) {
                // RH peut voir tous les pointages
                $userIds = User::where('societe_id', $user->societe_id)
                               
                               ->pluck('id');
    
                return Pointage::with(['user', 'societe'])
                ->whereIn('user_id', $userIds)->get();
            }
    
            if ($user->hasAnyRole(['Chef_Dep', 'Chef_Projet'])) {
                // Chef_Dep ou Chef_Projet : voir les pointages du même département et société
                $userIds = User::where('departement_id', $user->departement_id)
                               ->where('societe_id', $user->societe_id)
                               ->pluck('id');
    
                return Pointage::with(['user', 'societe'])
                               ->whereIn('user_id', $userIds)
                               ->get();
            }
    
            if ($user->hasRole('Employe')) {
                // Employé : ne voir que ses propres pointages
                return Pointage::with(['user', 'societe'])
                               ->where('user_id', $user->id)
                               ->get();
            }
    
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }
    
        /**
         * Store a newly created resource in storage.
         */
        public function store(Request $request)
        {
            $rules = [
                'user_id' => 'required|exists:users,id',
                'date' => 'required|date',
                'heureEntree' => 'nullable|date_format:H:i',
                'heureSortie' => 'nullable|date_format:H:i',
                'statutJour' => 'required|in:present,absent,retard',
                'overtimeHours' => 'nullable|numeric',
                'societe_id' => 'required|exists:societes,id',
            ];
    
            $data = $request->all();
            $authUser = auth()->user();
            $societeId = $authUser->societe_id;
            $valider = 0;
    
            if (isset($data[0])) {
                foreach ($data as &$p) {
                    $p['societe_id'] = $societeId;
                    $p['valider'] = $valider;
    
                    $existingPointage = Pointage::where('user_id', $p['user_id'])
                        ->whereDate('date', $p['date'])
                        ->first();
    
                    if ($existingPointage) {
                        return response()->json([
                            'message' => 'Un pointage existe déjà pour cet employé à cette date',
                            'error' => true
                        ], 422);
                    }
    
                    $validated = validator($p, $rules)->validate();
                    Pointage::create($validated);
                }
    
                return response()->json(['message' => 'Pointages ajoutés', 'societe_id' => $societeId]);
            } else {
                $data['societe_id'] = $societeId;
                $data['valider'] = $valider;
    
                $existingPointage = Pointage::where('user_id', $data['user_id'])
                    ->whereDate('date', $data['date'])
                    ->first();
    
                if ($existingPointage) {
                    return response()->json([
                        'message' => 'Un pointage existe déjà pour cet employé à cette date',
                        'error' => true
                    ], 422);
                }
    
                $validated = validator($data, $rules)->validate();
                $pointage = Pointage::create($validated);
    
                return response()->json(['message' => 'Pointage ajouté', 'societe_id' => $societeId, 'pointage' => $pointage]);
            }
        }
    
    
        /**
         * Update the specified resource in storage.
         */
        public function update(Request $request)
        {
            if (Auth::user()->hasRole('Employe')) {
                return response()->json(['message' => 'Les employés ne sont pas autorisés à modifier les pointages.'], 403);
            }

            foreach ($request->all() as $updateData) {
                $pointage = Pointage::findOrFail($updateData['id']);
                $rules = [
                    'heureEntree' => 'sometimes|date_format:H:i|nullable',
                    'heureSortie' => 'sometimes|date_format:H:i|nullable',
                    'statutJour' => 'sometimes|in:present,absent,retard',
                    'overtimeHours' => 'nullable|numeric',
                    'societe_id' => 'sometimes|exists:societes,id',
                ];
    
                $validated = validator($updateData, $rules)->validate();
                $pointage->update($validated);
            }
    
            return response()->json(['message' => 'Pointages modifiés']);
        }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request) {
        $ids = $request->input('ids');
        Pointage::whereIn('id', $ids)->delete();
        return response()->json(['message' => 'Pointages supprimés']);
    }


    public function valider($id)
    {
        $pointage = Pointage::findOrFail($id);

        if (Auth::user()->hasAnyRole(['RH', 'Chef_Dep', 'Chef_Projet'])) {
            $pointage->update(['valider' => 1]);

            return response()->json([
                'message' => 'Pointage validé avec succès.',
                'pointage' => $pointage
            ]);
        }

        return response()->json(['message' => 'Accès non autorisé. Seul le RH peut valider les pointages.'], 403);
    }

    /**
     * Invalider un pointage (passer de 1 à 0) - Accès : RH uniquement
     */
    public function invalider($id)
    {
        $pointage = Pointage::findOrFail($id);

        if (Auth::user()->hasRole('RH')) {
            $pointage->update(['valider' => 0]);

            return response()->json([
                'message' => 'Pointage invalidé avec succès.',
                'pointage' => $pointage
            ]);
        }

        return response()->json(['message' => 'Accès non autorisé. Seul le RH peut invalider les pointages.'], 403);
    }
}
