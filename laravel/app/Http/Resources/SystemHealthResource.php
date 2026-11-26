<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SystemHealthResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'success' => (bool) ($this->resource['ok'] ?? true),
            'status' => ($this->resource['ok'] ?? true) ? 'ok' : 'degraded',
            'service' => 'get-into-feed-cms',
            'database' => $this->resource['database'] ?? 'unknown',
            'cache' => $this->resource['cache'] ?? 'unknown',
            'queue' => $this->resource['queue'] ?? ['pending_jobs' => 0, 'failed_jobs' => 0],
            'timestamp' => $this->resource['timestamp'] ?? now()->toIso8601String(),
            'telemetry' => $this->when(isset($this->resource['telemetry']), $this->resource['telemetry'] ?? null),
        ];
    }
}
