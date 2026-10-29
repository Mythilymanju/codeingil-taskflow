<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // auth:sanctum already guards the route
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'status'      => ['required', Rule::in(['planned', 'active', 'completed'])],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Please enter a project name.',
            'name.max'      => 'The project name can be at most 150 characters.',
            'status.in'     => 'Status must be planned, active or completed.',
        ];
    }
}