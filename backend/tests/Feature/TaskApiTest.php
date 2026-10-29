<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    private function valid(array $over = []): array
    {
        return array_merge([
            'title' => 'Write tests', 'description' => 'Day 8',
            'status' => 'todo', 'priority' => 'high', 'due_date' => '2026-12-31',
        ], $over);
    }

    private function assertDenied($response): void
    {
        $this->assertContains($response->status(), [403, 404]);
    }

    public function test_task_crud_inside_own_project(): void
    {
        $alice   = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $alice->id]);
        Sanctum::actingAs($alice);

        $id = $this->postJson("/api/projects/{$project->id}/tasks", $this->valid())
            ->assertCreated()->json('data.id');

        $this->assertDatabaseHas('tasks', ['id' => $id, 'project_id' => $project->id, 'title' => 'Write tests']);

        $this->getJson("/api/projects/{$project->id}/tasks")->assertOk()->assertJsonCount(1, 'data');

        $this->putJson("/api/tasks/{$id}", $this->valid(['title' => 'Renamed', 'status' => 'done']))->assertOk();
        $this->assertDatabaseHas('tasks', ['id' => $id, 'title' => 'Renamed', 'status' => 'done']);

        $this->deleteJson("/api/tasks/{$id}")->assertNoContent();
        $this->assertDatabaseMissing('tasks', ['id' => $id]);
    }

    public function test_task_validation_errors(): void
    {
        $alice   = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $alice->id]);
        Sanctum::actingAs($alice);
        $url = "/api/projects/{$project->id}/tasks";

        $this->postJson($url, $this->valid(['title' => '']))->assertStatus(422)->assertJsonValidationErrors(['title']);
        $this->postJson($url, $this->valid(['priority' => 'urgent']))->assertStatus(422)->assertJsonValidationErrors(['priority']);
        $this->postJson($url, $this->valid(['status' => 'banana']))->assertStatus(422)->assertJsonValidationErrors(['status']);
        $this->postJson($url, $this->valid(['due_date' => '31/12/2026']))->assertStatus(422)->assertJsonValidationErrors(['due_date']);
    }

    public function test_tasks_stay_inside_their_own_project(): void
    {
        $alice = User::factory()->create();
        $a = Project::factory()->create(['user_id' => $alice->id]);
        $b = Project::factory()->create(['user_id' => $alice->id]);
        Task::factory()->count(2)->create(['project_id' => $a->id]);
        Task::factory()->count(1)->create(['project_id' => $b->id]);
        Sanctum::actingAs($alice);

        $this->getJson("/api/projects/{$a->id}/tasks")->assertJsonCount(2, 'data');
        $this->getJson("/api/projects/{$b->id}/tasks")->assertJsonCount(1, 'data');
    }

    public function test_user_cannot_touch_another_users_tasks(): void
    {
        $alice   = User::factory()->create();
        $bob     = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $alice->id]);
        $task    = Task::factory()->create(['project_id' => $project->id, 'title' => 'Mine', 'status' => 'todo']);

        Sanctum::actingAs($bob);

        $this->assertDenied($this->getJson("/api/projects/{$project->id}/tasks"));
        $this->assertDenied($this->postJson("/api/projects/{$project->id}/tasks", $this->valid()));
        $this->assertDenied($this->putJson("/api/tasks/{$task->id}", $this->valid(['title' => 'Hacked'])));
        $this->assertDenied($this->patchJson("/api/tasks/{$task->id}/status", ['status' => 'done']));
        $this->assertDenied($this->deleteJson("/api/tasks/{$task->id}"));

        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'title' => 'Mine', 'status' => 'todo']);
        $this->assertSame(1, Task::count());   // Bob's POST created nothing
    }
}