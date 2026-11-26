<?php

namespace App\Events;

use App\Models\BlogPost;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PostPublished
{
    use Dispatchable, SerializesModels;

    public function __construct(public readonly BlogPost $post) {}
}
