<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const CONTENT_TABLES = [
        'pages',
        'services',
        'case_studies',
        'blog_posts',
        'testimonials',
        'clients',
        'team_members',
        'faqs',
        'awards',
        'careers',
        'legal_pages',
    ];

    public function up(): void
    {
        foreach (self::CONTENT_TABLES as $tableName) {
            Schema::table($tableName, function (Blueprint $table): void {
                $table->string('status')->default('draft')->change();
            });
        }
    }

    public function down(): void
    {
        foreach (self::CONTENT_TABLES as $tableName) {
            Schema::table($tableName, function (Blueprint $table): void {
                $table->string('status')->default('published')->change();
            });
        }
    }
};
