<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('user:id,name')
            ->orderBy('id')
            ->get();

        return response()->json(['data' => $projects]);
    }

    public function show(Project $project)
    {
        $project->load('user:id,name');

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

    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['planned', 'active', 'completed'])],
        ];
    }
}