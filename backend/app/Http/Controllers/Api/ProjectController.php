<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        // scoped query: only the logged-in user's projects can be selected
        $query = $request->user()->projects()->with('user:id,name')->withCount('tasks');

        $search = trim((string) $request->query('search', ''));
        if ($search !== '') {
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
        Gate::authorize('view', $project);

        $project->load('user:id,name')->loadCount('tasks');

        return response()->json(['data' => $project]);
    }

    public function store(Request $request)
    {
        // the owner is the logged-in user, never something the client sends
        $project = $request->user()->projects()->create($request->validate($this->rules()));
        $project->load('user:id,name');

        return response()->json(['data' => $project], 201);
    }

    public function update(Request $request, Project $project)
    {
        Gate::authorize('update', $project);

        $project->update($request->validate($this->rules()));
        $project->load('user:id,name');

        return response()->json(['data' => $project]);
    }

    public function destroy(Project $project)
    {
        Gate::authorize('delete', $project);

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