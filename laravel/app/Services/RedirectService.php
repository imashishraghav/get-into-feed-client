<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Redirect;

class RedirectService
{
    /**
     * Automatically maintain 301 redirects when a blog post slug changes, collapsing chains and preventing loops.
     */
    public function handleBlogSlugChange(string $oldSlug, string $newSlug): ?Redirect
    {
        $oldSlug = trim($oldSlug, '/');
        $newSlug = trim($newSlug, '/');

        if ($oldSlug === '' || $newSlug === '' || $oldSlug === $newSlug) {
            return null;
        }

        $sourcePath = '/blog/'.$oldSlug;
        $targetPath = '/blog/'.$newSlug;

        // Prevent A -> B -> A loop if the slug reverts to an earlier URL
        Redirect::query()
            ->where('source_url', $targetPath)
            ->update(['is_active' => false]);

        // Collapse existing redirect chains pointing to the old slug so they jump directly to new target
        Redirect::query()
            ->where('target_url', $sourcePath)
            ->where('is_active', true)
            ->update(['target_url' => $targetPath]);

        $redirect = Redirect::updateOrCreate(
            ['source_url' => $sourcePath],
            [
                'target_url' => $targetPath,
                'status_code' => 301,
                'is_active' => true,
            ]
        );

        AuditLog::log('REDIRECT_AUTO_CREATED', $redirect, null, [
            'source_url' => $sourcePath,
            'target_url' => $targetPath,
            'status_code' => 301,
        ]);

        return $redirect;
    }
}
