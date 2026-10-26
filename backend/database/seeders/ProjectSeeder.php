<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
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

        $projects = Project::factory()->count(5)->for($user)->create();

        foreach ($projects as $project) {
            Task::factory()->count(rand(2, 4))->for($project)->create();
        }
    }
}