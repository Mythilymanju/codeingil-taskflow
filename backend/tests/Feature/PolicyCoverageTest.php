<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class PolicyCoverageTest extends TestCase
{
    public function test_every_api_route_is_protected_except_the_public_ones(): void
    {
        $public = ['api/health', 'api/register', 'api/login'];

        foreach (Route::getRoutes() as $route) {
            if (! str_starts_with($route->uri(), 'api/') || in_array($route->uri(), $public, true)) {
                continue;
            }

            $this->assertContains('auth:sanctum', $route->gatherMiddleware(), "Unprotected route: {$route->uri()}");
        }
    }
}