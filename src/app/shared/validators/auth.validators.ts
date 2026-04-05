import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 64;

/** Allows letters, digits, underscores and hyphens only. */
export const usernamePatternValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  return /^[a-zA-Z0-9_-]+$/.test(control.value)
    ? null
    : { usernamePattern: true };
};

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
