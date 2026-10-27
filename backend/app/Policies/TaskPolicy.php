<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    public function view(User $user, Task $task): Response
    {
        return $this->owner($user, $task);
    }

    public function update(User $user, Task $task): Response
    {
        return $this->owner($user, $task);
    }

    public function delete(User $user, Task $task): Response
    {
        return $this->owner($user, $task);
    }

    private function owner(User $user, Task $task): Response
    {
        return $task->project->user_id === $user->id
            ? Response::allow()
            : Response::denyAsNotFound();
    }
}