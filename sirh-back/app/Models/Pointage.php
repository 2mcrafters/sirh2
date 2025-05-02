<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pointage extends Model
{
    protected $fillable = ['user_id', 'date', 'heureEntree', 'heureSortie', 'statutJour', 'overtimeHours'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
