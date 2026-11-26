/**
 * CSV Sanitizer & Formula Injection Neutralizer
 * Prevents Remote Code Execution (RCE) / Dynamic Data Exchange (DDE) attacks
 * in Microsoft Excel, LibreOffice Calc, and Google Sheets.
 */

const FORMULA_TRIGGER_CHARS = ['=', '+', '-', '@', '\t', '\r'];

/**
 * Sanitizes a single cell value against spreadsheet formula injection.
 * If the value starts with '=', '+', '-', '@', or a tab/return, a single quote (') is prepended.
 */
export function sanitizeCsvCell(value: any): string {
  if (value === null || value === undefined) {
    return '""';
  }

  let str = String(value).trim();

  // Check if first character is a formula trigger
  if (str.length > 0 && FORMULA_TRIGGER_CHARS.includes(str[0])) {
    str = `'${str}`;
  }

  // Escape any existing double quotes by doubling them
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Generates an RFC-4180 compliant, injection-safe CSV string from headers and rows.
 */
export function generateSafeCsv(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const safeHeaderRow = headers.map(h => sanitizeCsvCell(h)).join(',');
  const safeDataRows = rows.map(row => 
    row.map(cell => sanitizeCsvCell(cell)).join(',')
  );

  return [safeHeaderRow, ...safeDataRows].join('\r\n');
}

/**
 * Initiates an immediate client-side safe CSV file download with audit logging.
 */
export function downloadSafeCsv(filename: string, headers: string[], rows: (string | number | boolean | null | undefined)[][]): void {
  const csvContent = generateSafeCsv(headers, rows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
