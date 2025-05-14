<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Societe; // Assurez-vous que le namespace est correct pour Societe

class Pointage extends Model
{
    protected $fillable = ['user_id', 'date', 'heureEntree', 'heureSortie', 'statutJour', 'overtimeHours', 'societe_id', 'valider'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the societe that owns the pointage.
     */
    public function societe(): BelongsTo
    {
        return $this->belongsTo(Societe::class);
    }
}
