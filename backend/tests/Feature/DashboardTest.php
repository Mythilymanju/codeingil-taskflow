<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private function seedFor(User $user): Project
    {
        $project = Project::factory()->create(['user_id' => $user->id]);

        foreach ([['todo', 'high'], ['todo', 'low'], ['in_progress', 'high'], ['done', 'medium']] as [$s, $p]) {
            Task::factory()->create(['project_id' => $project->id, 'status' => $s, 'priority' => $p]);
        }

        return $project;
    }

    public function test_requires_authentication(): void
    {
        $this->getJson('/api/dashboard/stats')->assertUnauthorized();
        $this->getJson('/api/tasks')->assertUnauthorized();
    }

    public function test_counts_are_consistent_and_scoped_to_the_user(): void
    {
        $alice = User::factory()->create();
        $bob   = User::factory()->create();
        $this->seedFor($alice);
        $this->seedFor($bob);

        Sanctum::actingAs($alice);
        $stats = $this->getJson('/api/dashboard/stats')->assertOk()->json();

        $this->assertSame(4, $stats['total_tasks']);
        $this->assertSame($stats['total_tasks'], array_sum($stats['by_status']));
        $this->assertSame($stats['total_tasks'], array_sum($stats['by_priority']));
        $this->assertSame(25, $stats['completion_percent']);
    }

    public function test_filters_work_alone_and_combined(): void
    {
        $alice = User::factory()->create();
        $this->seedFor($alice);
        Sanctum::actingAs($alice);

        $this->getJson('/api/tasks?status=todo')->assertJsonPath('total', 2);
        $this->getJson('/api/tasks?priority=high')->assertJsonPath('total', 2);
        $this->getJson('/api/tasks?status=todo&priority=high')->assertJsonPath('total', 1);
        $this->getJson('/api/tasks?status=banana')->assertStatus(422);
    }

    public function test_stats_and_filters_update_after_a_status_change(): void
    {
        $alice   = User::factory()->create();
        $project = $this->seedFor($alice);
        Sanctum::actingAs($alice);

        $todo = Task::where('project_id', $project->id)->where('status', 'todo')->first();

        $this->travel(5)->minutes();

        $this->patchJson("/api/tasks/{$todo->id}/status", ['status' => 'done'])->assertOk();

        $after = $this->getJson('/api/dashboard/stats')->assertOk()->json();

        $this->assertSame(1, $after['by_status']['todo']);
        $this->assertSame(2, $after['by_status']['done']);
        $this->assertSame(4, $after['total_tasks']);
        $this->assertSame(50, $after['completion_percent']);
        $this->assertSame($todo->id, $after['recent_tasks'][0]['id']);

        $this->getJson('/api/tasks?status=done')->assertJsonPath('total', 2);
        $this->getJson('/api/tasks?status=todo')->assertJsonPath('total', 1);
    }

    public function test_user_cannot_change_another_users_task(): void
{
    $alice = User::factory()->create();
    $bob   = User::factory()->create();
    $task  = Task::where('project_id', $this->seedFor($bob)->id)->first();
    $original = $task->status;

    Sanctum::actingAs($alice);
    $this->patchJson("/api/tasks/{$task->id}/status", ['status' => 'done'])->assertNotFound();

    // the real proof: Bob's task was not changed
    $this->assertSame($original, $task->fresh()->status);
}
}