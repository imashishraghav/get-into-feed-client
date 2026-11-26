<?php

namespace App\Providers;

use App\Events\PostPublished;
use App\Listeners\InvalidatePostCachesAndSitemap;
use App\Models\AuditLog;
use App\Models\BlogPost;
use App\Models\Lead;
use App\Models\Media;
use App\Models\Redirect;
use App\Models\Setting;
use App\Models\User;
use App\Policies\AuditLogPolicy;
use App\Policies\BlogPostPolicy;
use App\Policies\LeadPolicy;
use App\Policies\MediaPolicy;
use App\Policies\RedirectPolicy;
use App\Policies\SettingPolicy;
use App\Policies\UserPolicy;
use App\Repositories\Contracts\BlogPostRepositoryInterface;
use App\Repositories\EloquentBlogPostRepository;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            BlogPostRepositoryInterface::class,
            EloquentBlogPostRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        Gate::policy(BlogPost::class, BlogPostPolicy::class);
        Gate::policy(Media::class, MediaPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Setting::class, SettingPolicy::class);
        Gate::policy(AuditLog::class, AuditLogPolicy::class);
        Gate::policy(Redirect::class, RedirectPolicy::class);
        Gate::policy(Lead::class, LeadPolicy::class);

        Event::listen(PostPublished::class, InvalidatePostCachesAndSitemap::class);

        // Security Audit Logging: Successful Authentication
        Event::listen(Login::class, function (Login $event) {
            try {
                if ($event->user) {
                    $event->user->update([
                        'last_login_at' => now(),
                        'last_login_ip' => request()->ip(),
                    ]);

                    AuditLog::create([
                        'user_id' => $event->user->id,
                        'user_email' => $event->user->email,
                        'action' => 'LOGIN',
                        'auditable_type' => get_class($event->user),
                        'auditable_id' => $event->user->id,
                        'ip_address' => request()->ip(),
                        'user_agent' => request()->userAgent(),
                    ]);
                }
            } catch (\Throwable $e) {
                // Ignore logging failures to prevent blocking login
            }
        });

        // Security Audit Logging: User Logout
        Event::listen(Logout::class, function (Logout $event) {
            try {
                AuditLog::create([
                    'user_id' => $event->user?->id,
                    'user_email' => $event->user?->email,
                    'action' => 'LOGOUT',
                    'auditable_type' => $event->user ? get_class($event->user) : null,
                    'auditable_id' => $event->user?->id,
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);
            } catch (\Throwable $e) {
                // Ignore logging failures
            }
        });

        // Security Audit Logging: Failed Authentication Attempts
        Event::listen(Failed::class, function (Failed $event) {
            try {
                $attemptedEmail = $event->credentials['email'] ?? ($event->credentials['username'] ?? 'unknown');
                AuditLog::create([
                    'user_id' => $event->user?->id,
                    'user_email' => $attemptedEmail,
                    'action' => 'FAILED_LOGIN',
                    'auditable_type' => $event->user ? get_class($event->user) : null,
                    'auditable_id' => $event->user?->id,
                    'new_values' => [
                        'guard' => $event->guard ?? 'web',
                        'attempted_email' => $attemptedEmail,
                    ],
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);
            } catch (\Throwable $e) {
                // Ignore logging failures
            }
        });
    }
}
