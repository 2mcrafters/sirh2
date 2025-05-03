<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\UsersImport;
use App\Exports\UsersExport;
use Maatwebsite\Excel\Facades\Excel;

class UserExcelController extends Controller
{
    // public function import(Request $request)
    // {
    //     $request->validate([
    //         'file' => 'required|mimes:xlsx,csv', 
    //     ]);

        
    //     Excel::import(new UsersImport, $request->file('file'));

    //     return back()->with('success', 'Les employés ont été importés avec succès.');
    // }


    public function import(Request $request)
{
    try {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv|max:10240', // Adjust validation as needed
        ]);

        $file = $request->file('file');

        // Handle file processing here
        // Example: Excel::import(new EmployeImport, $file); // Using a package like Laravel Excel

        return response()->json(['message' => 'File imported successfully'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error processing file', 'error' => $e->getMessage()], 500);
    }
}


    public function exportUsers()
    {
        return Excel::download(new UsersExport, 'employes.xlsx');
    }
}
