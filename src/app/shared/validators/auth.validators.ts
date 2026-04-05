import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// ── Limits ────────────────────────────────────────────────
export const USERNAME_MIN  = 3;
export const USERNAME_MAX  = 30;
export const PASSWORD_MIN  = 8;
export const PASSWORD_MAX  = 64;
export const NAME_MIN      = 2;
export const NAME_MAX      = 50;
export const MESSAGE_MAX   = 500;

// ── Username ──────────────────────────────────────────────

/** Allows letters, digits, underscores and hyphens only. */
export const usernamePatternValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  return /^[a-zA-Z0-9_-]+$/.test(control.value)
    ? null
    : { usernamePattern: true };
};

// ── Password ──────────────────────────────────────────────

/** Requires at least one uppercase letter. */
export const hasUppercaseValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  return /[A-Z]/.test(control.value) ? null : { hasUppercase: true };
};

/** Requires at least one lowercase letter. */
export const hasLowercaseValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  return /[a-z]/.test(control.value) ? null : { hasLowercase: true };
};

/** Requires at least one digit. */
export const hasNumberValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  return /[0-9]/.test(control.value) ? null : { hasNumber: true };
};

/** Requires at least one special character. */
export const hasSpecialCharValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  return /[^a-zA-Z0-9]/.test(control.value) ? null : { hasSpecialChar: true };
};

// ── Name ──────────────────────────────────────────────────

/**
 * Allows letters (including accented), spaces, hyphens and apostrophes.
 * Supports international names such as O'Brien, Mary-Jane, José.
 */
export const namePatternValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  return /^[\p{L}\s'\-]+$/u.test(control.value)
    ? null
    : { namePattern: true };
};

// ── Email ─────────────────────────────────────────────────

/**
 * Stricter email validation than Angular's built-in.
 * Requires a local part, @, a domain with at least one dot, and a TLD of 2+ chars.
 * Rejects: a@b, user@.com, @domain.com
 */
export const emailFormatValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(control.value) ? null : { emailFormat: true };
};

// ── Phone ─────────────────────────────────────────────────

/**
 * Validates international phone numbers (E.164-inspired).
 * Accepts optional leading +, digits, spaces, hyphens and parentheses.
 * Requires between 7 and 15 digits (ignoring formatting characters).
 */
export const phoneValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  const raw: string = control.value;
  const digitsOnly = raw.replace(/[\s\-()+]/g, '');
  const formatOk = /^[+\d(][\d\s\-()+]*$/.test(raw);
  const lengthOk = digitsOnly.length >= 7 && digitsOnly.length <= 15;
  return formatOk && lengthOk ? null : { phoneFormat: true };
};

/**
 * Validates the local part of a phone number (after the country dial code).
 * Accepts digits, spaces and hyphens. Requires between 4 and 15 digits.
 */
export const localPhoneValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  const raw: string = String(control.value);
  const digitsOnly = raw.replace(/[\s\-]/g, '');
  if (!/^\d+$/.test(digitsOnly)) return { phoneFormat: true };
  if (digitsOnly.length < 4 || digitsOnly.length > 15) return { phoneFormat: true };
  return null;
};
