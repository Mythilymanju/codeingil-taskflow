<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    // Makes the request look like it comes from the React app (Sanctum SPA mode)
    private function spa()
    {
        return $this->withHeaders([
            'Origin'  => 'http://localhost:5173',
            'Referer' => 'http://localhost:5173',
        ]);
    }

    public function test_user_can_register(): void
    {
        $this->spa()->postJson('/api/register', [
            'name' => 'Asha', 'email' => 'asha@example.test',
            'password' => 'password123', 'password_confirmation' => 'password123',
        ])->assertSuccessful();

        $this->assertDatabaseHas('users', ['email' => 'asha@example.test']);
    }

    public function test_register_rejects_duplicate_email_and_missing_fields(): void
    {
        User::factory()->create(['email' => 'taken@example.test']);

        $this->spa()->postJson('/api/register', [
            'name' => 'X', 'email' => 'taken@example.test',
            'password' => 'password123', 'password_confirmation' => 'password123',
        ])->assertStatus(422)->assertJsonValidationErrors(['email']);

        $this->spa()->postJson('/api/register', [])
            ->assertStatus(422)->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_login_succeeds_and_fails_correctly(): void
    {
        User::factory()->create(['email' => 'asha@example.test', 'password' => bcrypt('password123')]);

        $this->spa()->postJson('/api/login', ['email' => 'asha@example.test', 'password' => 'password123'])
            ->assertSuccessful();

        $status = $this->spa()->postJson('/api/login', ['email' => 'asha@example.test', 'password' => 'wrong'])->status();
        $this->assertContains($status, [401, 422]);   // ADAPT: use the one your app returns
    }

    public function test_user_endpoint_returns_current_user(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/user')->assertOk()->assertJsonFragment(['email' => $user->email]);
    }

    public static function protectedEndpoints(): array
    {
        return [
            ['GET', '/api/user'], ['GET', '/api/projects'], ['POST', '/api/projects'],
            ['GET', '/api/projects/1'], ['PUT', '/api/projects/1'], ['DELETE', '/api/projects/1'],
            ['GET', '/api/projects/1/tasks'], ['POST', '/api/projects/1/tasks'],
            ['PUT', '/api/tasks/1'], ['PATCH', '/api/tasks/1/status'], ['DELETE', '/api/tasks/1'],
            ['GET', '/api/tasks'], ['GET', '/api/dashboard/stats'],
        ];
    }

    #[DataProvider('protectedEndpoints')]
    public function test_guests_cannot_call_protected_endpoints(string $method, string $uri): void
    {
        $this->json($method, $uri)->assertUnauthorized();
    }
}