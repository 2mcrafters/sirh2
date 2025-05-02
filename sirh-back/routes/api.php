<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\AbsenceRequestController;
use App\Http\Controllers\StatistiquesController;
use App\Http\Controllers\PointageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AbsenceRequestExcelController;
use App\Http\Controllers\DepartementExcelController;
use App\Http\Controllers\PointageExcelController;
use App\Http\Controllers\UserExcelController;
use App\Http\Middleware\RoleMiddleware;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
Route::get('/statistiques/presence', [StatistiquesController::class, 'statistiquesPresence']);
Route::get('/departements', [DepartementController::class, 'index']);
Route::post('/departements', [DepartementController::class, 'store']);
Route::put('/departements', [DepartementController::class, 'update']);
Route::delete('/departements', [DepartementController::class, 'destroy']);
Route::get('/employes', [UserController::class, 'index']);
Route::post('/employes', [UserController::class, 'store']);
Route::put('/employes/update/{id}', [UserController::class, 'update']);
Route::delete('/employes', [UserController::class, 'destroy']); 
Route::get('/absences', [AbsenceRequestController::class, 'index']);
Route::post('/absences', [AbsenceRequestController::class, 'store']);
Route::put('/absences/update/{id}', [AbsenceRequestController::class, 'update']);
Route::delete('/absences', [AbsenceRequestController::class, 'destroy']);
Route::get('/pointages', [PointageController::class, 'index']);
Route::post('/pointages', [PointageController::class, 'store']);
Route::put('/pointages', [PointageController::class, 'update']);
Route::delete('/pointages', [PointageController::class, 'destroy']);
});
// imports

Route::post('/departements/import', [DepartementExcelController::class, 'importDepartements'])->name('departements.import');
Route::post('/import-employes', [UserExcelController::class, 'import'])->name('import.employes');

// exports

Route::get('/export-employes', [UserExcelController::class, 'exportUsers']);
Route::get('/export-absence-requests', [AbsenceRequestExcelController::class, 'exportAbsences']);
Route::get('/export-pointages', [PointageExcelController::class, 'exportPointages']);
Route::get('/export-departements', [DepartementExcelController::class, 'exportDepartements']);

Route::middleware(['auth:sanctum', 'role:RH'])->group(function () {
    Route::post('/assign-role', [AuthController::class, 'assignRole']);
    Route::get('/user_permission', function () {
        $user = auth()->user();
        return response()->json([
            'user' => $user->name,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions(),
        ]);
    });
});




Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


