<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Navigation\NavigationGroup;
use Filament\Navigation\NavigationItem;
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

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login(\App\Filament\Pages\Auth\Login::class)
            ->passwordReset()
            ->brandLogo(fn () => view('filament.brand-logo'))
            ->brandLogoHeight('2.25rem')
            ->favicon('/favicon.svg')
            ->font('Plus Jakarta Sans')
            ->colors([
                'primary' => [
                    50 => '#f0f5ff',
                    100 => '#e0ebff',
                    200 => '#c7d9fe',
                    300 => '#a4c0fc',
                    400 => '#7b9df8',
                    500 => '#254bdb',
                    600 => '#1d3bb8',
                    700 => '#183096',
                    800 => '#162877',
                    900 => '#0b0f19',
                    950 => '#080c14',
                ],
                'gray' => Color::Slate,
            ])
            ->darkMode(false)
            ->defaultThemeMode(\Filament\Enums\ThemeMode::Light)
            ->sidebarCollapsibleOnDesktop()
            ->sidebarWidth('11.5rem')
            ->collapsedSidebarWidth('4.5rem')
            ->globalSearchKeyBindings(['mod+k', '/'])
            ->spa()
            ->renderHook(
                \Filament\View\PanelsRenderHook::HEAD_END,
                fn (): string => view('filament.custom-theme')->render()
            )
            ->renderHook(
                \Filament\View\PanelsRenderHook::GLOBAL_SEARCH_AFTER,
                fn (): string => view('filament.topbar-actions')->render()
            )
            ->navigationGroups([
                NavigationGroup::make('Enquiries & Leads')->collapsible(false),
                NavigationGroup::make('Posts')->collapsible(false),
                NavigationGroup::make('Content Studio')->collapsible(false),
                NavigationGroup::make('Settings')->collapsible(false),
            ])
            ->navigationItems([
                \Filament\Navigation\NavigationItem::make('Add Post')
                    ->group('Posts')
                    ->icon('heroicon-o-pencil-square')
                    ->url(fn (): string => \App\Filament\Resources\BlogPostResource::getUrl('create'))
                    ->isActiveWhen(fn (): bool => request()->routeIs('filament.admin.resources.blog-posts.create'))
                    ->sort(2),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->userMenuItems([
                \Filament\Navigation\MenuItem::make()
                    ->label('Two-Factor Security (MFA)')
                    ->url('/admin/two-factor/setup')
                    ->icon('heroicon-o-shield-check'),
            ])
            ->pages([
                \App\Filament\Pages\Dashboard::class,
            ])
            ->widgets([
                \App\Filament\Widgets\DashboardWelcomeWidget::class,
                \App\Filament\Widgets\RecentLeadsWidget::class,
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
