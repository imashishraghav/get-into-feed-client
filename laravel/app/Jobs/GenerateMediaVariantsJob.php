<?php

namespace App\Jobs;

use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateMediaVariantsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public function __construct(public readonly int $mediaId) {}

    public function handle(MediaService $mediaService): void
    {
        $media = Media::find($this->mediaId);
        if (! $media) {
            return;
        }

        $mediaService->optimizeStoredMedia($media);
    }
}
