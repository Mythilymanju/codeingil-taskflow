<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search'   => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        // scoped query: only the logged-in user's projects can be selected
        $query = $request->user()->projects()->with('user:id,name')->withCount('tasks');

        $search = trim((string) $request->query('search', ''));
        if ($search !== '') {
            $escaped = addcslashes($search, '\\%_');
            $query->where('name', 'like', "%{$escaped}%");
        }

        // ->through() keeps the paginator shape (current_page, last_page, total...) the React page reads
        $projects = $query
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate($request->integer('per_page', 6))
            ->through(fn ($project) => ProjectResource::make($project)->resolve())
            ->withQueryString();

        return response()->json($projects);
    }

    public function show(Project $project)
    {
        Gate::authorize('view', $project);

        $project->load('user:id,name')->loadCount('tasks');

        return ProjectResource::make($project);
    }

    public function store(StoreProjectRequest $request)
    {
        // the owner is the logged-in user, never something the client sends
        $project = $request->user()->projects()->create($request->validated());
        $project->load('user:id,name');

        return ProjectResource::make($project)->response()->setStatusCode(201);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $project->update($request->validated());
        $project->load('user:id,name')->loadCount('tasks');

        return ProjectResource::make($project);
    }

    public function destroy(Request $request, Project $project)
    {
        Gate::authorize('delete', $project);

        Log::info('project.deleted', [
            'project_id' => $project->id,
            'user_id'    => $request->user()->id,
        ]);

        $project->delete();

        return response()->noContent();
    }
}