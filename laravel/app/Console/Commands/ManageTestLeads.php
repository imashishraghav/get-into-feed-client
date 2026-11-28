<?php

namespace App\Console\Commands;

use App\Models\Lead;
use Illuminate\Console\Command;

class ManageTestLeads extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'leads:manage-test 
                            {--dry-run : Preview matching test leads without making changes (default)}
                            {--flag : Mark matching records with is_test = 1}
                            {--delete : Permanently delete matching test leads (requires confirmation)}
                            {--force : Force delete without prompt}
                            {--database= : Explicit database connection to use}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Safely detect, flag, or prune test/bot leads from the CRM database';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $connection = $this->option('database') ?: config('database.default');

        $query = Lead::on($connection)->withTrashed()->where(function ($q) {
            $q->where('is_test', true)
                ->orWhere('name', 'like', '%Verification Bot%')
                ->orWhere('name', 'like', '%QA%')
                ->orWhere('name', 'like', '%Test%')
                ->orWhere('name', 'like', '%Bot%')
                ->orWhere('name', 'like', '%Tester%')
                ->orWhere('email', 'like', '%@example.com%')
                ->orWhere('email', 'like', 'bot-%')
                ->orWhere('email', 'like', 'qa-%')
                ->orWhere('email', 'like', 'test-%');
        });

        $leads = $query->get();
        $count = $leads->count();

        $this->info('=== CRM Test & Bot Lead Inspector ===');

        if ($count === 0) {
            $this->info('No test or bot leads detected in the database. All records appear legitimate.');

            return Command::SUCCESS;
        }

        $rows = $leads->map(function ($lead) {
            return [
                'id' => $lead->id,
                'lead_code' => $lead->lead_code ?: 'N/A',
                'name' => $lead->name,
                'email' => $lead->email ?: 'N/A',
                'phone' => $lead->phone ?: 'N/A',
                'is_test' => $lead->is_test ? 'Yes (1)' : 'No (0)',
                'created_at' => $lead->created_at?->toDateTimeString() ?: 'N/A',
            ];
        })->toArray();

        $this->table(['ID', 'Code', 'Name', 'Email', 'Phone', 'is_test', 'Created At'], $rows);
        $this->info("Found {$count} matching test/bot lead records.");

        $shouldDelete = $this->option('delete');
        $shouldFlag = $this->option('flag');
        $isDryRun = $this->option('dry-run') || (! $shouldDelete && ! $shouldFlag);

        if ($isDryRun) {
            $this->comment('DRY-RUN MODE ACTIVE: No database changes were made.');
            $this->comment('• To flag these records as test data: php artisan leads:manage-test --flag');
            $this->comment('• To delete these records:           php artisan leads:manage-test --delete');

            return Command::SUCCESS;
        }

        if ($shouldFlag) {
            $query->update(['is_test' => true]);
            $this->info("Successfully flagged {$count} records with is_test = 1. They are now excluded from production CRM analytics.");

            return Command::SUCCESS;
        }

        if ($shouldDelete) {
            $force = $this->option('force');
            if (! $force && ! $this->confirm("Are you sure you want to permanently delete these {$count} test leads? This action cannot be undone.")) {
                $this->warn('Operation cancelled by user. No records were deleted.');

                return Command::SUCCESS;
            }

            $deletedCount = Lead::on($connection)->whereIn('id', $leads->pluck('id'))->forceDelete();
            $this->info("Successfully deleted {$deletedCount} test lead records from the database.");

            return Command::SUCCESS;
        }

        return Command::SUCCESS;
    }
}
