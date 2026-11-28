<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('cms:publish-scheduled')
    ->everyFiveMinutes()
    ->withoutOverlapping(10)
    ->runInBackground()
    ->appendOutputTo(storage_path('logs/scheduled-publishing.log'));
