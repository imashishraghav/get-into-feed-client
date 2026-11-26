/**
 * GetIntoFeed Agency CRM — India-First GST & TDS Invoicing Engine
 * Implements Delhi NCR GST logic (State Code 07), SAC codes with CA review flags,
 * and Income-tax Act, 2025 Section 393 Withholding Tax (TDS) Table Items.
 */

import { SAC_PRICE_BOOK, SECTION_393_TDS_RATES } from './priceBook.js';

export const AGENCY_GSTIN = '07AAAAA0000A1Z5';
export const AGENCY_STATE_CODE = '07'; // Delhi State

export const SAC_CODES = {
  ADVERTISING: { code: '998361', name: 'Advertising and creative marketing services' },
  VIDEO_PRODUCTION: { code: '998366', name: 'Photography and video reels production services' },
  WEB_DEVELOPMENT: { code: '998313', name: 'Information technology design & web development' },
  BRAND_STRATEGY: { code: '998365', name: 'Management consulting and brand strategy' }
};

export const TDS_SECTIONS = {
  NONE: { section: 'None', defaultRate: 0, description: 'No TDS deduction' },
  SECTION_194C: { section: 'Income-tax Act 2025 Sec 393 Item 1 (Contractor)', defaultRate: 2, description: 'Advertising & Contractor services (1% - 2%)' },
  SECTION_194J: { section: 'Income-tax Act 2025 Sec 393 Item 4 (Technical/Professional)', defaultRate: 10, description: 'Technical & Professional services (2% - 10%)' }
};

export const INDIAN_STATE_CODES = {
  '07': 'Delhi (Intra-State: CGST 9% + SGST 9%)',
  '06': 'Haryana (Gurugram / Faridabad — IGST 18%)',
  '09': 'Uttar Pradesh (Noida / Greater Noida — IGST 18%)',
  '27': 'Maharashtra (Mumbai / Pune — IGST 18%)',
  '29': 'Karnataka (Bengaluru — IGST 18%)',
  '03': 'Punjab (Chandigarh — IGST 18%)',
  '08': 'Rajasthan (Jaipur — IGST 18%)',
  '33': 'Tamil Nadu (Chennai — IGST 18%)'
};

/**
 * Extracts 2-digit state code from 15-character Indian GSTIN
 */
export function extractStateCodeFromGstin(gstin) {
  if (!gstin || gstin.length < 2) return AGENCY_STATE_CODE;
  const code = gstin.trim().slice(0, 2);
  return INDIAN_STATE_CODES[code] ? code : AGENCY_STATE_CODE;
}

/**
 * Generates sequential financial year invoice number (e.g. GIF/26-27/0101)
 */
export function generateInvoiceNumber(seqNumber = 101, financialYear = '26-27') {
  return `GIF/${financialYear}/${String(seqNumber).padStart(4, '0')}`;
}

/**
 * Calculates complete GST and Section 393 TDS breakdown for an invoice
 */
export function calculateGstInvoice({
  baseAmount,
  clientStateCode = AGENCY_STATE_CODE,
  sacCode = '998361',
  sec393Key = 'sec_393_item_1_corp',
  customTdsRate = null,
  tdsSection = null,
  tdsRate = null
}) {
  const isIntraState = clientStateCode === AGENCY_STATE_CODE;
  const totalGst = Math.round(baseAmount * 0.18);

  const cgst = isIntraState ? Math.round(totalGst / 2) : 0;
  const sgst = isIntraState ? Math.round(totalGst / 2) : 0;
  const igst = isIntraState ? 0 : totalGst;

  const grossInvoiceTotal = baseAmount + totalGst;

  // Income-tax Act, 2025 Section 393 Withholding
  let effectiveRate = customTdsRate !== null ? Number(customTdsRate) : null;
  if (effectiveRate === null && tdsRate !== null) {
    effectiveRate = Number(tdsRate);
  }
  if (effectiveRate === null && tdsSection && TDS_SECTIONS[tdsSection]) {
    effectiveRate = TDS_SECTIONS[tdsSection].defaultRate;
  }
  const tdsConfig = SECTION_393_TDS_RATES[sec393Key] || SECTION_393_TDS_RATES['sec_393_item_1_corp'];
  const appliedTdsRate = effectiveRate !== null ? effectiveRate : tdsConfig.ratePercent;
  
  // TDS is computed on base amount (excluding GST)
  const tdsDeducted = Math.round(baseAmount * (appliedTdsRate / 100));
  const netReceivable = grossInvoiceTotal - tdsDeducted;

  // SAC CA Review Flag check
  const sacEntry = Object.values(SAC_PRICE_BOOK).find(s => s.code === sacCode);
  const caReviewFlag = sacEntry?.caReviewFlag || null;

  return {
    baseAmount,
    clientStateCode,
    clientStateName: INDIAN_STATE_CODES[clientStateCode] || 'Other State',
    isIntraState,
    sacCode,
    sacName: sacEntry?.name || 'Advertising Services',
    caReviewFlag,
    taxBreakdown: {
      cgstRate: isIntraState ? 9 : 0,
      cgstAmount: cgst,
      sgstRate: isIntraState ? 9 : 0,
      sgstAmount: sgst,
      igstRate: isIntraState ? 0 : 18,
      igstAmount: igst,
      totalGst
    },
    grossInvoiceTotal,
    tdsDetails: {
      sec393Key: tdsConfig.id,
      statutoryReference: tdsConfig.statutoryReference,
      formerSectionLabel: tdsConfig.formerSectionLabel,
      payerType: tdsConfig.payerType,
      category: tdsConfig.category,
      ratePercent: appliedTdsRate,
      tdsDeducted
    },
    netReceivable,
    formatted: {
      base: `₹${baseAmount.toLocaleString('en-IN')}`,
      gst: `₹${totalGst.toLocaleString('en-IN')}`,
      gross: `₹${grossInvoiceTotal.toLocaleString('en-IN')}`,
      tds: `₹${tdsDeducted.toLocaleString('en-IN')}`,
      net: `₹${netReceivable.toLocaleString('en-IN')}`
    }
  };
}
