<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    public function view(User $user, Project $project): Response
    {
        return $this->owner($user, $project);
    }

    public function update(User $user, Project $project): Response
    {
        return $this->owner($user, $project);
    }

    public function delete(User $user, Project $project): Response
    {
        return $this->owner($user, $project);
    }

    private function owner(User $user, Project $project): Response
    {
        return $project->user_id === $user->id
            ? Response::allow()
            : Response::denyAsNotFound();
    }
}