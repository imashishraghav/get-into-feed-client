<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;
use Illuminate\Support\Facades\Auth;

class CmsCommandCenterHeaderWidget extends Widget
{
    protected static string $view = 'filament.widgets.cms-command-center-header';

    protected static bool $isLazy = false;

    protected static ?int $sort = -10;

    protected int|string|array $columnSpan = 'full';

    public function getUserName(): string
    {
        $user = Auth::user();
        if (! $user) {
            return 'Team Member';
        }
        $parts = explode(' ', trim($user->name));

        return $parts[0] ?: 'Ashish';
    }

    public function getGreeting(): string
    {
        $hour = (int) date('H');
        if ($hour < 12) {
            return 'Good morning';
        } elseif ($hour < 17) {
            return 'Good afternoon';
        } else {
            return 'Good evening';
        }
    }
}
