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
         $authUser = auth()->user();
         $societeId = $authUser->societe_id;
 
         if ($authUser->hasRole('Employe')) {
             // Employé : uniquement ses demandes d'absence
             $absences = AbsenceRequest::with(['user.departement'])
                 ->where('user_id', $authUser->id)
                 ->get();
 
         } elseif ($authUser->hasAnyRole(['Chef_Dep', 'Chef_Projet'])) {
             // Chef_Dep ou Chef_Projet : demandes des employés de son département ET de sa société
             $absences = AbsenceRequest::with(['user.departement'])
                 ->whereHas('user', function ($query) use ($authUser, $societeId) {
                     $query->where('departement_id', $authUser->departement_id)
                           ->where('societe_id', $societeId);
                 })
                 ->get();
 
         } elseif ($authUser->hasRole('RH')) {
             // RH : toutes les demandes sans restriction
             $absences = AbsenceRequest::with(['user.departement'])
             ->whereHas('user', function ($query) use ($societeId) {
                $query->where('societe_id', $societeId);
            })
             ->get();

 
         } else {
             return response()->json(['message' => 'Rôle non autorisé'], 403);
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
            'statut' => 'required|in:en_attente,validé,rejeté,approuvé',
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


    public function update(Request $request, $id)
    {
        $rules = [
            'user_id' => 'sometimes|required|exists:users,id',
            'type' => 'sometimes|required|in:Congé,maladie,autre',
            'dateDebut' => 'sometimes|required|date',
            'dateFin' => 'sometimes|required|date|after_or_equal:dateDebut',
            'motif' => 'nullable|string',
            'statut' => 'sometimes|required|in:en_attente,validé,rejeté,approuvé',
            'justification' => 'nullable',
        ];
    
        $validator = validator($request->all(), $rules);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }
    
        $absence = AbsenceRequest::findOrFail($id);
    
        $validatedData = $validator->validated();
    
        // Mise à jour des champs présents dans la requête validée
        if (isset($validatedData['user_id'])) {
            $absence->user_id = $validatedData['user_id'];
        }
        if (isset($validatedData['type'])) {
            $absence->type = $validatedData['type'];
        }
        if (isset($validatedData['dateDebut'])) {
            $absence->dateDebut = $validatedData['dateDebut'];
        }
        if (isset($validatedData['dateFin'])) {
            $absence->dateFin = $validatedData['dateFin'];
        }
        if (isset($validatedData['motif'])) {
            $absence->motif = $validatedData['motif'];
        }
        if (isset($validatedData['statut'])) {
            $absence->statut = $validatedData['statut'];
        }
    
        // Gestion du fichier justification
        if ($request->hasFile('justification')) {
            // Supprimer l'ancien fichier s'il existe
            if ($absence->justification && Storage::disk('public')->exists($absence->justification)) {
                Storage::disk('public')->delete($absence->justification);
            }
    
            // Enregistrer le nouveau fichier
            $path = $request->file('justification')->store('justifications', 'public');
            $absence->justification = $path;
    
        } else if ($request->input('justification') === null) {
            // Si le champ `justification` est explicitement `null`, supprimer le fichier existant
            if ($absence->justification && Storage::disk('public')->exists($absence->justification)) {
                Storage::disk('public')->delete($absence->justification);
            }
            $absence->justification = null;
    
        } else if (is_string($request->input('justification'))) {
            // Si la justification est une chaîne de caractères (lien existant), conserver sans modification
            $absence->justification = $absence->justification;
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
