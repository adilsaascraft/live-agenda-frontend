/**
 * Normalises a WhatsApp number to E.164 (e.g. "+919876543210").
 *
 * Accepted:
 *  - Indian numbers: 9876543210, 09876543210, 919876543210, +91 98765-43210
 *  - International numbers with "+" or "00": +44 7911 123456, 0044 7911 123456
 * Returns null when the input is not a plausible number.
 */
export function normalizeWhatsAppNumber(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (/[^\d+\s\-().]/.test(value)) return null;
  if (value.lastIndexOf("+") > 0) return null; // "+" is only valid as a prefix

  const hasPlus = value.startsWith("+");
  let digits = value.replace(/\D/g, "");
  if (!digits) return null;

  const international = (candidate: string): string | null => {
    if (!/^[1-9]\d{7,14}$/.test(candidate)) return null;
    // Indian numbers have a fixed shape: +91 followed by 10 digits starting 6–9.
    if (candidate.startsWith("91") && !/^91[6-9]\d{9}$/.test(candidate)) return null;
    return `+${candidate}`;
  };

  if (hasPlus) return international(digits);

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
    return international(digits);
  }

  if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`;
  if (/^0[6-9]\d{9}$/.test(digits)) return `+91${digits.slice(1)}`;
  if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`;
  return null;
}

export interface ShareFormValues {
  name: string;
  phone: string;
}

export interface ShareFormErrors {
  name?: string;
  phone?: string;
}

export type ShareFormValidation =
  | { ok: true; value: { name: string; phone: string } }
  | { ok: false; errors: ShareFormErrors };

const MAX_NAME_LENGTH = 80;

export function validateShareForm(values: ShareFormValues): ShareFormValidation {
  const errors: ShareFormErrors = {};
  const name = values.name.trim().replace(/\s+/g, " ");

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > MAX_NAME_LENGTH) {
    errors.name = `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }

  const phone = values.phone.trim();
  const normalized = phone ? normalizeWhatsAppNumber(phone) : null;
  if (!phone) errors.phone = "Please enter your WhatsApp number.";
  else if (!normalized) {
    errors.phone =
      "Enter a valid mobile number. For numbers outside India, include the country code (e.g. +44 7911 123456).";
  }

  if (errors.name || errors.phone || !normalized) return { ok: false, errors };
  return { ok: true, value: { name, phone: normalized } };
}
