<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    // Day 5: tasks of one project (GET /api/projects/{project}/tasks)
    public function index(Project $project)
    {
        Gate::authorize('view', $project);

        $tasks = $project->tasks()->orderBy('id')->get();

        return response()->json(['data' => $tasks]);
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

        return Task::ownedBy($userId)
            ->with('project:id,name')
            ->when($filters['project_id'] ?? null, fn ($q, $v) => $q->where('project_id', $v))
            ->when($filters['status'] ?? null,     fn ($q, $v) => $q->where('status', $v))
            ->when($filters['priority'] ?? null,   fn ($q, $v) => $q->where('priority', $v))
            ->latest('updated_at')
            ->paginate($filters['per_page'] ?? 10)
            ->withQueryString();
    }

    public function store(Request $request, Project $project)
    {
        Gate::authorize('update', $project);

        $task = $project->tasks()->create($request->validate($this->rules()));

        return response()->json(['data' => $task], 201);
    }

    public function update(Request $request, Task $task)
    {
        Gate::authorize('update', $task);

        $task->update($request->validate($this->rules()));

        return response()->json(['data' => $task]);
    }

    // Day 7: change only the status (PATCH /api/tasks/{task}/status)
    public function updateStatus(Request $request, Task $task)
    {
        Gate::authorize('update', $task);

        $data = $request->validate([
            'status' => ['required', Rule::in(Task::STATUSES)],
        ]);

        $task->update($data);

        return response()->json(['data' => $task->load('project:id,name')]);
    }

    public function destroy(Task $task)
    {
        Gate::authorize('delete', $task);

        $task->delete();

        return response()->noContent();
    }

    private function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(Task::STATUSES)],
            'priority' => ['required', Rule::in(Task::PRIORITIES)],
            'due_date' => ['nullable', 'date_format:Y-m-d'],
        ];
    }
}