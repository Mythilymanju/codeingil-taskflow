<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProjectApiTest extends TestCase
{
    use RefreshDatabase;

    private function valid(array $over = []): array
    {
        return array_merge(['name' => 'Client Portal', 'description' => 'Internal demo', 'status' => 'planned'], $over);
    }

    private function assertDenied($response): void
    {
        $this->assertContains($response->status(), [403, 404]);   // your policy: one consistent choice
    }

    public function test_list_returns_only_own_projects(): void
    {
        $alice = User::factory()->create();
        $bob   = User::factory()->create();
        Project::factory()->count(2)->create(['user_id' => $alice->id]);
        Project::factory()->create(['user_id' => $bob->id]);

        Sanctum::actingAs($alice);
        $this->getJson('/api/projects')->assertOk()->assertJsonCount(2, 'data');
    }

    public function test_create_project_is_owned_by_current_user(): void
    {
        $alice = User::factory()->create();
        $bob   = User::factory()->create();
        Sanctum::actingAs($alice);

        $this->postJson('/api/projects', $this->valid(['user_id' => $bob->id]))->assertCreated();

        $this->assertDatabaseHas('projects', ['name' => 'Client Portal', 'user_id' => $alice->id]);
        $this->assertDatabaseMissing('projects', ['user_id' => $bob->id]);
    }

    public function test_create_validation_errors(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/projects', $this->valid(['name' => '']))
            ->assertStatus(422)->assertJsonValidationErrors(['name']);

        $this->postJson('/api/projects', $this->valid(['status' => 'banana']))
            ->assertStatus(422)->assertJsonValidationErrors(['status']);

        $this->postJson('/api/projects', $this->valid(['name' => str_repeat('a', 151)]))
            ->assertStatus(422)->assertJsonValidationErrors(['name']);
    }

    public function test_show_update_and_missing_record(): void
    {
        $alice   = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $alice->id, 'name' => 'Old']);
        Sanctum::actingAs($alice);

        $this->getJson("/api/projects/{$project->id}")->assertOk()->assertJsonFragment(['name' => 'Old']);
        $this->putJson("/api/projects/{$project->id}", $this->valid(['name' => 'New']))->assertOk();
        $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => 'New']);

        $this->putJson("/api/projects/{$project->id}", $this->valid(['status' => 'nope']))->assertStatus(422);
        $this->getJson('/api/projects/999999')->assertNotFound();
    }

    public function test_delete_project(): void
    {
        $alice   = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $alice->id]);
        Sanctum::actingAs($alice);

        $this->deleteJson("/api/projects/{$project->id}")->assertNoContent();
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_search_is_case_insensitive(): void
    {
        $alice = User::factory()->create();
        Project::factory()->create(['user_id' => $alice->id, 'name' => 'Alpha Portal']);
        Project::factory()->create(['user_id' => $alice->id, 'name' => 'Beta App']);
        Sanctum::actingAs($alice);

        // ADAPT: use the query name from your Day 4 code (search, q, ...)
        $this->getJson('/api/projects?search=alpha')->assertOk()->assertJsonCount(1, 'data');
    }

    public function test_user_cannot_touch_another_users_project(): void
    {
        $alice   = User::factory()->create();
        $bob     = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $alice->id, 'name' => 'Private']);

        Sanctum::actingAs($bob);

        $this->assertDenied($this->getJson("/api/projects/{$project->id}"));
        $this->assertDenied($this->putJson("/api/projects/{$project->id}", $this->valid(['name' => 'Hacked'])));
        $this->assertDenied($this->deleteJson("/api/projects/{$project->id}"));

        $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => 'Private']);
    }
}