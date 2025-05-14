<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('pointages', function (Blueprint $table) {
            // Ajouter la colonne valider
            $table->boolean('valider')->default(0)->after('statutJour')->comment('Validation du pointage (0: Non validé, 1: Validé)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('pointages', function (Blueprint $table) {
            // Supprimer la colonne valider
            $table->dropColumn('valider');
        });
    }
};
