<x-filament-panels::page>
    <form wire:submit.prevent="save" class="space-y-6">
        {{ $this->form }}

        <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl shadow-sm">
            <div class="text-xs text-slate-500 dark:text-slate-400">
                <span class="font-semibold text-slate-700 dark:text-slate-200">Automatic Versioning Active:</span> Saving captures an immutable snapshot for 1-click rollback.
            </div>

            <x-filament::button type="submit" size="lg" color="primary" icon="heroicon-o-check">
                Save All Settings & Synchronize Frontend
            </x-filament::button>
        </div>
    </form>
</x-filament-panels::page>
