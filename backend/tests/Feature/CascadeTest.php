<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CascadeTest extends TestCase
{
    use RefreshDatabase;

    public function test_deleting_a_project_deletes_only_its_tasks(): void
    {
        $alice = User::factory()->create();
        $doomed = Project::factory()->create(['user_id' => $alice->id]);
        $kept   = Project::factory()->create(['user_id' => $alice->id]);
        Task::factory()->count(3)->create(['project_id' => $doomed->id]);
        Task::factory()->count(2)->create(['project_id' => $kept->id]);

        Sanctum::actingAs($alice);
        $this->deleteJson("/api/projects/{$doomed->id}")->assertNoContent();

        $this->assertDatabaseMissing('tasks', ['project_id' => $doomed->id]);
        $this->assertSame(2, Task::where('project_id', $kept->id)->count());
    }
}