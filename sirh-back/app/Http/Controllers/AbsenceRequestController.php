<?php

namespace App\Http\Controllers;

use App\Models\AbsenceRequest;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

use Illuminate\Http\Request;

class AbsenceRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     public function index()
     {
         $user = auth()->user();
     
         if ($user->hasRole('Employe')) {
             // Employé : uniquement ses demandes
             $absences = AbsenceRequest::with(['user.departement'])
                 ->where('user_id', $user->id)
                 ->get();
     
         } elseif ($user->hasRole('Chef_Dep')) {
             // Chef_Dep : demandes des employés de son département
             $absences = AbsenceRequest::with(['user.departement'])
                 ->whereHas('user', function ($query) use ($user) {
                     $query->where('departement_id', $user->departement_id);
                 })
                 ->get();
     
         } elseif ($user->hasRole('RH')) {
             // RH : toutes les demandes
             $absences = AbsenceRequest::with(['user.departement'])->get();
     
         } else {
             return response()->json(['message' => 'Role non autorisé'], 403);
         }
     
         return response()->json($absences);
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
     */  public function store(Request $request) {
        $rules = [
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:Congé,maladie,autre',
            'dateDebut' => 'required|date',
            'dateFin' => 'required|date|after_or_equal:dateDebut',
            'motif' => 'nullable|string',
            'statut' => 'required|in:en_attente,validé,rejeté',
            'justification' => 'nullable|file|mimes:jpeg,png,pdf|max:2048', 
        ];
    
        $data = $request->except('justification');
    
        if (isset($data[0])) {
            foreach ($data as $a) {
                $validator = validator($a, $rules);
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 422);
                }
                
                if ($request->hasFile('justification')) {
                    $file = $request->file('justification');
                    $fileName = time() . '_' . $file->getClientOriginalName();
                    $file->storeAs('justifications', $fileName, 'public');
                    $data['justification'] = 'justifications/' . $fileName;
                    
                }
                
                // Ensure user_id is included
                if (!isset($a['user_id'])) {
                    return response()->json(['error' => 'user_id is required'], 422);
                }
                
                AbsenceRequest::create($a);
            }
            return response()->json(['message' => 'Absences ajoutées']);
        } else {
            $validator = validator($data, $rules);
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }
            
            if ($request->hasFile('justification')) {
                $file = $request->file('justification');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->storeAs('justifications', $fileName, 'public');
                $data['justification'] = 'justifications/' . $fileName;

            }
            
            // Ensure user_id is included
            if (!isset($data['user_id'])) {
                return response()->json(['error' => 'user_id is required'], 422);
            }
            
            return AbsenceRequest::create($data);
        }
    }
    

    /**
     * Display the specified resource.
     */
    public function show(AbsenceRequest $absenceRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AbsenceRequest $absenceRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */

public function update(Request $request, $id)
{
    $absence = AbsenceRequest::findOrFail($id);

    $absence->user_id = $request->input('user_id');
    $absence->type = $request->input('type');
    $absence->dateDebut = $request->input('dateDebut');
    $absence->dateFin = $request->input('dateFin');
    $absence->motif = $request->input('motif');
    $absence->statut = $request->input('statut');

    // Si un fichier justification est envoyé
    if ($request->hasFile('justification')) {
        // Supprimer l'ancien fichier s'il existe
        if ($absence->justification && Storage::disk('public')->exists($absence->justification)) {
            Storage::disk('public')->delete($absence->justification);
        }

        // Enregistrer le nouveau fichier
        $path = $request->file('justification')->store('justifications', 'public');
        $absence->justification = $path;
    }

    $absence->save();

    return response()->json([
        'message' => 'Demande mise à jour avec succès.',
        'absence' => $absence
    ]);
}



    /**
     * Remove the specified resource from storage.
     */

    public function destroy(Request $request) {
        $ids = $request->input('ids');
        AbsenceRequest::whereIn('id', $ids)->delete();
        return response()->json(['message' => 'Absences supprimées']);
    }
}
