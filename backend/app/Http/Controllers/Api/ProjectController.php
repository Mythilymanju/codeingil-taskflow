<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;

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
}