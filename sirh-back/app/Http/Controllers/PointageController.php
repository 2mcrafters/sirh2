<?php

namespace App\Http\Controllers;

use App\Models\Pointage;
use Illuminate\Http\Request;
use App\Models\User;

class PointageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
    
        if ($user->hasRole('RH')) {
            // RH peut voir tous les pointages
            return Pointage::with('user')->get();
        }
    
        if ($user->hasRole('Chef_Dep')) {
            // Chef de département peut voir les pointages de son département
            $userIds = User::where('departement_id', $user->departement_id)->pluck('id');
            return Pointage::with('user')->whereIn('user_id', $userIds)->get();
        }
    
        if ($user->hasRole('Employe')) {
            // Employé ne voit que ses propres pointages
            return Pointage::with('user')->where('user_id', $user->id)->get();
        }
    
        return response()->json(['message' => 'Accès non autorisé.'], 403);
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
        $rules = [
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'heureEntree' => 'nullable|date_format:H:i|nullable',
            'heureSortie' => 'nullable|date_format:H:i|nullable',
            'statutJour' => 'required|in:present,absent,retard',
            'overtimeHours' => 'nullable|numeric',
        ];

        $data = $request->all();
        if (isset($data[0])) {
            foreach ($data as $p) {
                // Check for existing pointage on the same day
                $existingPointage = Pointage::where('user_id', $p['user_id'])
                    ->whereDate('date', $p['date'])
                    ->first();

                if ($existingPointage) {
                    return response()->json([
                        'message' => 'Un pointage existe déjà pour cet employé à cette date',
                        'error' => true
                    ], 422);
                }

                validator($p, $rules)->validate();
                Pointage::create($p);
            }
            return response()->json(['message' => 'Pointages ajoutés']);
        } else {
            // Check for existing pointage on the same day
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
            return Pointage::create($validated);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Pointage $pointage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pointage $pointage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request) {
        foreach ($request->all() as $updateData) {
            $pointage = Pointage::findOrFail($updateData['id']);
            $rules = [
                'heureEntree' => 'sometimes|date_format:H:i|nullable',
                'heureSortie' => 'sometimes|date_format:H:i|nullable',
                'statutJour' => 'sometimes|in:present,absent,retard',
                'overtimeHours' => 'nullable|numeric',
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

}
