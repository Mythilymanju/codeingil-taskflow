<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class QueryCountTest extends TestCase
{
    use RefreshDatabase;

    private function queriesFor(string $url): int
    {
        DB::flushQueryLog();
        DB::enableQueryLog();
        $this->getJson($url)->assertOk();
        return count(DB::getQueryLog());
    }

    private function seedProjects(User $user, int $count): void
    {
        Project::factory()->count($count)->create(['user_id' => $user->id])
            ->each(fn ($p) => Task::factory()->count(2)->create(['project_id' => $p->id]));
    }

    public function test_project_and_task_lists_do_not_grow_with_row_count(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->seedProjects($user, 2);
        $smallProjects = $this->queriesFor('/api/projects');
        $smallTasks    = $this->queriesFor('/api/tasks');
        $smallStats    = $this->queriesFor('/api/dashboard/stats');

        $this->seedProjects($user, 6);
        $this->assertSame($smallProjects, $this->queriesFor('/api/projects'));
        $this->assertSame($smallTasks,    $this->queriesFor('/api/tasks'));
        $this->assertSame($smallStats,    $this->queriesFor('/api/dashboard/stats'));
    }
}