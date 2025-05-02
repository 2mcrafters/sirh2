<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        // $users = User::all();
        $user = auth()->user(); 

        if ($user->hasRole('Employe')) {
            
            $users = [$user]; 
        } elseif ($user->hasRole('Chef_Dep')) {
            
            $departementId = $user->departement_id;  
            $users = User::where('departement_id', $departementId)->get();  
        } elseif ($user->hasRole('RH')) {
            
            $users = User::all();
        } else {
            
            return response()->json(['message' => 'Role non autorisé'], 403);
        }
        foreach ($users as $user) {
            $user->profile_picture_url = $user->profile_picture_url;
        }
        return $users;
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
            'name' => 'required|string|max:100',
            'cin' => 'required|string|max:20',
            'rib' => 'required|string|max:32',
            'situationFamiliale' => 'required|in:Célibataire,Marié,Divorcé',
            'nbEnfants' => 'required|integer|min:0',
            'adresse' => 'required|string|max:255',
            'prenom' => 'required|string|max:50',
            'tel' => 'required|string|max:20',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:Employe,Chef_Dep,RH',
            'typeContrat' => 'required|in:Permanent,Temporaire',
            'date_naissance' => 'required|date',
            'statut' => 'required|in:Actif,Inactif,Congé,Malade',
            'departement_id' => 'required|exists:departements,id',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    
        $data = $request->all();
    
        if (isset($data[0])) {
            foreach ($data as $record) {
                $validator = Validator::make($record, $rules);
    
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 422);
                }
    
                $validated = $validator->validated();
    
                // Handle picture as base64 or skip it
                if (!empty($record['picture'])) {
                    $image = $record['picture'];
                    $fileName = time() . '_' . uniqid() . '.jpg';
                    \Storage::disk('public')->put("profile_picture/$fileName", base64_decode($image));
                    $validated['picture'] = $fileName;
                }
    
                $validated['password'] = Hash::make($validated['password']);
                $user = User::create($validated);
    
                if (isset($validated['role'])) {
                    $user->assignRole($validated['role']);
                }
            }
    
            return response()->json(['message' => 'Employés ajoutés']);
        }
    
        // Single user
        $validated = $request->validate($rules);
    
        if ($request->hasFile('picture') && $request->file('picture')->isValid()) {
            $profilePicture = $request->file('picture');
            $fileName = time() . '_' . $profilePicture->getClientOriginalName();
            $profilePicture->storeAs('profile_picture', $fileName, 'public');
            $validated['picture'] = $fileName;
        }
    
        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
    
        if (isset($validated['role'])) {
            $user->assignRole($validated['role']);
        }
    
        return $user;
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->profile_picture_url = $user->profile_picture_url;
        return $user;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
{
    $user = User::findOrFail($id);

    $rules = [
        'cin' => 'sometimes|string|max:20',
        'rib' => 'sometimes|string|max:32',
        'situationFamiliale' => 'sometimes|in:Célibataire,Marié,Divorcé',
        'nbEnfants' => 'sometimes|integer|min:0',
        'adresse' => 'sometimes|string|max:255',
        'name' => 'sometimes|string|max:50',
        'prenom' => 'sometimes|string|max:50',
        'tel' => 'sometimes|string|max:20',
        'email' => 'sometimes|email|unique:users,email,' . $id,
        'password' => 'sometimes|string|min:6',
        'role' => 'sometimes|in:Employe,Chef_Dep,RH',
        'typeContrat' => 'sometimes|in:Permanent,Temporaire',
        'date_naissance' => 'sometimes|date',
        'statut' => 'sometimes|in:Actif,Inactif,Congé,Malade',
        'departement_id' => 'sometimes|exists:departements,id',
        'picture' => 'sometimes|file|image|mimes:jpeg,png,jpg,gif|max:2048',
    ];

    $validator = Validator::make($request->all(), $rules);
    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()], 422);
    }

    $data = $validator->validated();

    // Gérer l'image si elle est envoyée
    if ($request->hasFile('picture')) {
        $file = $request->file('picture');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $file->storeAs('profile_picture', $fileName, 'public');

        // Supprimer l'ancienne image si elle existe
        if ($user->picture && Storage::disk('public')->exists('profile_picture/' . $user->picture)) {
            Storage::disk('public')->delete('profile_picture/' . $user->picture);
        }

        $data['picture'] = $fileName;
    }

    // Hasher le mot de passe si fourni
    if (isset($data['password'])) {
        $data['password'] = Hash::make($data['password']);
    }

    $user->update($data);

    // Gérer le rôle si fourni
    if (isset($data['role'])) {
        $user->syncRoles([$data['role']]);
    }

    return response()->json(['message' => 'Utilisateur mis à jour avec succès', 'user' => $user]);
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request) {
        $ids = $request->input('ids');
        User::whereIn('id', $ids)->delete();
        return response()->json(['message' => 'Employés supprimés']);
    }
}