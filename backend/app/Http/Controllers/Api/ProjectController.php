<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
   public function index(Request $request)
{
    $request->validate([
        'search' => ['nullable', 'string', 'max:100'],
        'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
    ]);

    $query = Project::with('user:id,name')->withCount('tasks');

    $search = trim((string) $request->query('search', ''));
    if ($search !== '') {
        // escape % and _ so users can search for them literally
        $escaped = addcslashes($search, '\\%_');
        $query->where('name', 'like', "%{$escaped}%");
    }

    $projects = $query
        ->orderByDesc('created_at')
        ->orderByDesc('id')
        ->paginate($request->integer('per_page', 6))
        ->withQueryString();

    return response()->json($projects);
}

    public function show(Project $project)
    {
        $project->load('user:id,name')->loadCount('tasks');

        return response()->json(['data' => $project]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());

        // TEMPORARY: there is no login yet, so every new project is owned
        // by the first (demo) user. Day 6 replaces this with $request->user()->id
        $validated['user_id'] = User::firstOrFail()->id;

        $project = Project::create($validated);
        $project->load('user:id,name');

        return response()->json(['data' => $project], 201);
    }

    public function update(Request $request, Project $project)
    {
        $project->update($request->validate($this->rules()));
        $project->load('user:id,name');

        return response()->json(['data' => $project]);
    }

    public function destroy(Project $project)
{
    $project->delete();

    return response()->noContent();
}

    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['planned', 'active', 'completed'])],
        ];
    }
}