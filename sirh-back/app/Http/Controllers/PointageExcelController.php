<?php

namespace App\Http\Controllers;
use App\Exports\PointagesExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;

class PointageExcelController extends Controller
{
    public function import(Request $request)
    {
        return back()->with('success', 'Importation réussie !');
    }

    public function exportPointages()
    {
        return Excel::download(new PointagesExport, 'pointages.xlsx');
    }
}
