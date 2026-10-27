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
        $demo = User::firstOrCreate(
            ['email' => 'demo@codeingil.test'],
            ['name' => 'Demo User', 'password' => Hash::make('password')]
        );

        $other = User::firstOrCreate(
            ['email' => 'other@codeingil.test'],
            ['name' => 'Other User', 'password' => Hash::make('password')]
        );

        foreach ([[$demo, 5], [$other, 3]] as [$user, $count]) {
            Project::factory()->count($count)->for($user)->create()
                ->each(fn (Project $project) => Task::factory()->count(rand(2, 4))->for($project)->create());
        }
    }
}