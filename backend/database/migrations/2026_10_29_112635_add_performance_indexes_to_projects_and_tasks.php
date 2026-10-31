<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->index(['project_id', 'status'], 'tasks_project_status_idx');
            $table->index(['project_id', 'priority'], 'tasks_project_priority_idx');
            $table->index('updated_at', 'tasks_updated_at_idx');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->index(['user_id', 'status'], 'projects_user_status_idx');
            $table->index(['user_id', 'name'], 'projects_user_name_idx');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex('tasks_project_status_idx');
            $table->dropIndex('tasks_project_priority_idx');
            $table->dropIndex('tasks_updated_at_idx');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex('projects_user_status_idx');
            $table->dropIndex('projects_user_name_idx');
        });
    }
};