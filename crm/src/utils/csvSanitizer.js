/**
 * CSV Sanitizer & Formula Injection Neutralizer
 * Prevents Remote Code Execution (RCE) / Dynamic Data Exchange (DDE) attacks
 * in Microsoft Excel, LibreOffice Calc, and Google Sheets.
 */

const FORMULA_TRIGGER_CHARS = ['=', '+', '-', '@', '\t', '\r'];

/**
 * Sanitizes a single cell value against spreadsheet formula injection.
 * If the value starts with '=', '+', '-', '@', or a tab/return, a single quote (') is prepended.
 *
 * @param {string | number | boolean | null | undefined} value
 * @returns {string}
 */
export function sanitizeCsvCell(value) {
  if (value === null || value === undefined) {
    return '""';
  }

  let str = String(value).trim();

  if (str.length > 0 && FORMULA_TRIGGER_CHARS.includes(str[0])) {
    str = `'${str}`;
  }

  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Generates an RFC-4180 compliant, injection-safe CSV string from headers and rows.
 *
 * @param {string[]} headers
 * @param {(string | number | boolean | null | undefined)[][]} rows
 * @returns {string}
 */
export function generateSafeCsv(headers, rows) {
  const safeHeaderRow = headers.map((h) => sanitizeCsvCell(h)).join(',');
  const safeDataRows = rows.map((row) => row.map((cell) => sanitizeCsvCell(cell)).join(','));

  return [safeHeaderRow, ...safeDataRows].join('\r\n');
}

/**
 * Initiates a client-side safe CSV file download.
 *
 * @param {string} filename
 * @param {string[]} headers
 * @param {(string | number | boolean | null | undefined)[][]} rows
 * @returns {void}
 */
export function downloadSafeCsv(filename, headers, rows) {
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
