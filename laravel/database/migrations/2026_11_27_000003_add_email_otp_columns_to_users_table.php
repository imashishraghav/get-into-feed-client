<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'two_factor_method')) {
                $table->string('two_factor_method', 20)->default('email')->after('two_factor_confirmed_at');
            }
            if (! Schema::hasColumn('users', 'two_factor_email_otp_hash')) {
                $table->string('two_factor_email_otp_hash')->nullable()->after('two_factor_method');
            }
            if (! Schema::hasColumn('users', 'two_factor_email_otp_purpose')) {
                $table->string('two_factor_email_otp_purpose', 30)->nullable()->after('two_factor_email_otp_hash');
            }
            if (! Schema::hasColumn('users', 'two_factor_email_otp_expires_at')) {
                $table->timestamp('two_factor_email_otp_expires_at')->nullable()->after('two_factor_email_otp_purpose');
            }
            if (! Schema::hasColumn('users', 'two_factor_email_otp_sent_at')) {
                $table->timestamp('two_factor_email_otp_sent_at')->nullable()->after('two_factor_email_otp_expires_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $cols = array_values(array_filter([
                Schema::hasColumn('users', 'two_factor_email_otp_sent_at') ? 'two_factor_email_otp_sent_at' : null,
                Schema::hasColumn('users', 'two_factor_email_otp_expires_at') ? 'two_factor_email_otp_expires_at' : null,
                Schema::hasColumn('users', 'two_factor_email_otp_purpose') ? 'two_factor_email_otp_purpose' : null,
                Schema::hasColumn('users', 'two_factor_email_otp_hash') ? 'two_factor_email_otp_hash' : null,
                Schema::hasColumn('users', 'two_factor_method') ? 'two_factor_method' : null,
            ]));

            if ($cols !== []) {
                $table->dropColumn($cols);
            }
        });
    }
};
