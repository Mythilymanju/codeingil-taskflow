<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Task extends Model
{
    use HasFactory;

    public const STATUSES = ['todo', 'in_progress', 'done'];
    public const PRIORITIES = ['low', 'medium', 'high'];

    protected $fillable = ['title', 'description', 'status', 'priority', 'due_date'];

    protected function casts(): array
    {
        return [
            'due_date' => 'date:Y-m-d',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

     public function scopeOwnedBy(Builder $query, int $userId): Builder
    {
        return $query->whereHas('project', fn ($p) => $p->where('user_id', $userId));
    }
}