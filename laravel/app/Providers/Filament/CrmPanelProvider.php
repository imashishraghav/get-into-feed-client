<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Navigation\NavigationGroup;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class CrmPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('crm')
            ->path('')
            ->domain(env('CRM_DOMAIN', 'crm.getintofeed.com'))
            ->login(\App\Filament\Pages\Auth\Login::class)
            ->passwordReset()
            ->brandName('GetIntoFeed CRM Studio OS')
            ->brandLogoHeight('2.25rem')
            ->favicon('/favicon.svg')
            ->font('Plus Jakarta Sans')
            ->colors([
                'primary' => [
                    50 => '#eef2ff',
                    100 => '#e0e7ff',
                    200 => '#c7d2fe',
                    300 => '#a5b4fc',
                    400 => '#818cf8',
                    500 => '#3155f4', // GetIntoFeed Core Blue
                    600 => '#2544db',
                    700 => '#1d35b8',
                    800 => '#182b96',
                    900 => '#172578',
                    950 => '#0f174a',
                ],
                'gray' => Color::Slate,
            ])
            ->darkMode(true)
            ->sidebarCollapsibleOnDesktop()
            ->sidebarWidth('14rem')
            ->collapsedSidebarWidth('4.5rem')
            ->globalSearchKeyBindings(['mod+k', '/'])
            ->spa()
            ->navigationGroups([
                NavigationGroup::make('Pipeline & Inbound')->collapsible(false),
                NavigationGroup::make('SLA & Follow-ups')->collapsible(false),
                NavigationGroup::make('Retainers & MRR')->collapsible(false),
            ])
            ->discoverResources(in: app_path('Filament/Crm/Resources'), for: 'App\\Filament\\Crm\\Resources')
            ->discoverPages(in: app_path('Filament/Crm/Pages'), for: 'App\\Filament\\Crm\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            ->widgets([
                \App\Filament\Crm\Widgets\CrmStatsOverviewWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
                \App\Http\Middleware\EnforceTwoFactorAuthentication::class,
            ]);
    }
}
