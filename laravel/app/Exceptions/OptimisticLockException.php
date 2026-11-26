<?php

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

class OptimisticLockException extends RuntimeException
{
    public function __construct(
        public readonly int $expectedVersion,
        public readonly int $currentVersion,
        public readonly array $latestSnapshot = [],
        string $message = 'This post was modified in another tab or device. Please review changes before saving.'
    ) {
        parent::__construct($message, 409);
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => $this->getMessage(),
            'code' => 409,
            'expected_version' => $this->expectedVersion,
            'current_version' => $this->currentVersion,
            'latest' => $this->latestSnapshot,
        ], 409);
    }
}
