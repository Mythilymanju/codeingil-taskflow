<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    // Day 5: tasks of one project (GET /api/projects/{project}/tasks)
    public function index(Project $project)
    {
        Gate::authorize('view', $project);

        return TaskResource::collection(
            $project->tasks()->orderBy('id')->get()
        );
    }

    // Day 7: all of the user's tasks with filters (GET /api/tasks)
    public function list(Request $request)
    {
        $userId = $request->user()->id;

        $filters = $request->validate([
            'project_id' => ['nullable', Rule::exists('projects', 'id')->where('user_id', $userId)],
            'status'     => ['nullable', Rule::in(Task::STATUSES)],
            'priority'   => ['nullable', Rule::in(Task::PRIORITIES)],
            'per_page'   => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        // ->through() keeps the paginator shape (total, last_page) that the dashboard reads
        return Task::ownedBy($userId)
            ->with('project:id,name')
            ->when($filters['project_id'] ?? null, fn ($q, $v) => $q->where('project_id', $v))
            ->when($filters['status'] ?? null,     fn ($q, $v) => $q->where('status', $v))
            ->when($filters['priority'] ?? null,   fn ($q, $v) => $q->where('priority', $v))
            ->latest('updated_at')
            ->paginate($filters['per_page'] ?? 10)
            ->through(fn ($task) => TaskResource::make($task)->resolve())
            ->withQueryString();
    }

    // POST /api/projects/{project}/tasks (authorization + validation live in StoreTaskRequest)
    public function store(StoreTaskRequest $request, Project $project)
    {
        $task = $project->tasks()->create($request->validated());

        return TaskResource::make($task)->response()->setStatusCode(201);
    }

    // PUT /api/tasks/{task} (authorization + validation live in UpdateTaskRequest)
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task->update($request->validated());

        return TaskResource::make($task);
    }

    // Day 7: change only the status (PATCH /api/tasks/{task}/status)
    public function updateStatus(Request $request, Task $task)
    {
        Gate::authorize('update', $task);

        $data = $request->validate([
            'status' => ['required', Rule::in(Task::STATUSES)],
        ]);

        $old = $task->status;
        $task->update($data);

        Log::info('task.status_changed', [
            'task_id' => $task->id,
            'from'    => $old,
            'to'      => $task->status,
            'user_id' => $request->user()->id,
        ]);

        return TaskResource::make($task->load('project:id,name'));
    }

    // DELETE /api/tasks/{task}
    public function destroy(Request $request, Task $task)
    {
        Gate::authorize('delete', $task);

        Log::info('task.deleted', [
            'task_id' => $task->id,
            'user_id' => $request->user()->id,
        ]);

        $task->delete();

        return response()->noContent();
    }
}