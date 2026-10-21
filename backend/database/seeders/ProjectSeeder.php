<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'demo@codeingil.test'],
            ['name' => 'Demo User', 'password' => Hash::make('password')]
        );

        Project::factory()->count(5)->for($user)->create();
    }
}