<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        Gate::authorize('update', $this->route('project'));
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'status'      => ['required', Rule::in(Task::STATUSES)],
            'priority'    => ['required', Rule::in(Task::PRIORITIES)],
            'due_date'    => ['nullable', 'date_format:Y-m-d'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'      => 'Please enter a task title.',
            'status.in'           => 'Status must be todo, in_progress or done.',
            'priority.in'         => 'Priority must be low, medium or high.',
            'due_date.date_format'=> 'Due date must look like 2026-12-31.',
        ];
    }
}