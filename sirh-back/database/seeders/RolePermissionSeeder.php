<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        
        $rolesPermissions = [
            'EMPLOYE' => [
                'demande absence',              
                'view profile',          
            ],
            'CHEF_DEP' => [
                'view team absences',           
                'validate absence',             
                'create absence',               
                'reject absence',               
            ],
            'RH' => [
                'view all absences',            
                'export excel',                
                'manage users',                 
                'assign roles',               
                'edit absence',               
                'delete absence',               
                'generate reports',            
            ],
        ];

        $allPermissions = collect($rolesPermissions)->flatten()->unique();

    
        foreach ($allPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        
        foreach ($rolesPermissions as $role => $permissions) {
            $roleModel = Role::firstOrCreate(['name' => $role]);
            $roleModel->syncPermissions($permissions);  
        }
    }
}
