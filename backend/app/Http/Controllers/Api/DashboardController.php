<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user   = $request->user();
        $userId = $user->id;

        $data = $request->validate([
            'project_id' => ['nullable', Rule::exists('projects', 'id')->where('user_id', $userId)],
        ]);

        $base = fn () => Task::ownedBy($userId)
            ->when($data['project_id'] ?? null, fn ($q, $v) => $q->where('project_id', $v));

        $rawStatus   = $base()->selectRaw('status, COUNT(*) as c')->groupBy('status')->pluck('c', 'status');
        $rawPriority = $base()->selectRaw('priority, COUNT(*) as c')->groupBy('priority')->pluck('c', 'priority');

        $byStatus   = collect(Task::STATUSES)->mapWithKeys(fn ($s) => [$s => (int) ($rawStatus[$s] ?? 0)]);
        $byPriority = collect(Task::PRIORITIES)->mapWithKeys(fn ($p) => [$p => (int) ($rawPriority[$p] ?? 0)]);

        $total = $byStatus->sum();
        $done  = $byStatus['done'];

        return response()->json([
            'projects_count'     => $user->projects()->count(),
            'total_tasks'        => $total,
            'by_status'          => $byStatus,
            'by_priority'        => $byPriority,
            'completion_percent' => $total > 0 ? (int) round($done / $total * 100) : 0,
            'recent_tasks'       => $base()->with('project:id,name')->latest('updated_at')->limit(5)->get(),
        ]);
    }
}