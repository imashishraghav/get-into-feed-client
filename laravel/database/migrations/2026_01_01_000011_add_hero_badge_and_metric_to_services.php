<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            if (! Schema::hasColumn('services', 'hero_badge')) {
                $table->string('hero_badge')->nullable()->after('icon_name');
            }
            if (! Schema::hasColumn('services', 'focus_metric')) {
                $table->string('focus_metric')->nullable()->after('hero_badge');
            }
            if (! Schema::hasColumn('services', 'included_disclaimer')) {
                $table->text('included_disclaimer')->nullable()->after('deliverables');
            }
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['hero_badge', 'focus_metric', 'included_disclaimer']);
        });
    }
};
