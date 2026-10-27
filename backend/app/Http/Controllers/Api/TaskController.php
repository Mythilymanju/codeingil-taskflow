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
    public function index(Project $project)
    {
        Gate::authorize('view', $project);

        $tasks = $project->tasks()->orderBy('id')->get();

        return response()->json(['data' => $tasks]);
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