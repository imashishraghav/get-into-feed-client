<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Services\AuditLogService;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LeadExportController extends Controller
{
    public function __construct(private readonly AuditLogService $audit) {}

    public function exportCsv(Request $request): StreamedResponse
    {
        $this->authorize('export', Lead::class);

        [$leads, $idsFiltered] = $this->resolveLeads($request);

        $this->audit->record('LEADS_EXPORTED', null, null, [
            'format' => 'CSV',
            'count' => $leads->count(),
            'ids_filtered' => $idsFiltered,
        ], $request->user());

        $filename = 'getintofeed-leads-'.date('Y-m-d-His').'.csv';

        return response()->streamDownload(function () use ($leads): void {
            $handle = fopen('php://output', 'w');
            fwrite($handle, "\xEF\xBB\xBF");
            fputcsv($handle, [
                'ID', 'Lead Code', 'Contact Name', 'Email Address', 'Phone', 'WhatsApp',
                'Company / Brand', 'Website', 'Interested Service', 'Budget Range',
                'Status', 'Priority', 'Origin Page', 'Form Identifier', 'Marketing Source',
                'Referrer', 'IP Address', 'Client Message', 'Submitted At',
            ]);

            foreach ($leads as $lead) {
                fputcsv($handle, [
                    $lead->id, $lead->lead_code, $lead->name, $lead->email, $lead->phone, $lead->whatsapp,
                    $lead->company, $lead->website, $lead->interested_service, $lead->budget,
                    $lead->status, $lead->priority, $lead->page_url, $lead->form_type, $lead->source,
                    $lead->referrer, $lead->ip_address, $lead->message,
                    $lead->created_at ? $lead->created_at->format('Y-m-d H:i:s') : '',
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
    }

    public function exportPdf(Request $request): View
    {
        $this->authorize('export', Lead::class);

        [$leads, $idsFiltered] = $this->resolveLeads($request);

        $this->audit->record('LEADS_EXPORTED', null, null, [
            'format' => 'PDF',
            'count' => $leads->count(),
            'ids_filtered' => $idsFiltered,
        ], $request->user());

        return view('admin.leads-pdf', compact('leads'));
    }

    /**
     * @return array{0: Collection<int, Lead>, 1: bool}
     */
    private function resolveLeads(Request $request): array
    {
        $ids = $request->query('ids');
        $query = Lead::production();
        $idsFiltered = ! empty($ids);

        if ($idsFiltered) {
            $idArray = is_array($ids) ? $ids : explode(',', (string) $ids);
            $query->whereIn('id', array_filter(array_map('intval', $idArray)));
        }

        return [$query->orderBy('created_at', 'desc')->get(), $idsFiltered];
    }
}
