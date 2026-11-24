<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\DashboardWelcomeWidget;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Support\Enums\MaxWidth;
use Illuminate\Contracts\Support\Htmlable;

class Dashboard extends BaseDashboard
{
    protected static ?string $navigationIcon = 'heroicon-o-home';

    protected static ?string $title = 'Dashboard';

    protected static ?string $navigationLabel = 'Dashboard';

    public function getMaxContentWidth(): MaxWidth|string|null
    {
        return MaxWidth::Full;
    }

    public function getHeading(): string|Htmlable
    {
        return '';
    }

    public function getWidgets(): array
    {
        return [
            DashboardWelcomeWidget::class,
        ];
    }

    public function getColumns(): int|string|array
    {
        return 1;
    }
}
