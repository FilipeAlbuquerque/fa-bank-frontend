import { FormControl } from '@angular/forms';
import {
  usernamePatternValidator,
  hasUppercaseValidator,
  hasLowercaseValidator,
  hasNumberValidator,
  hasSpecialCharValidator,
} from './auth.validators';

const ctrl = (value: string) => new FormControl(value);

describe('usernamePatternValidator', () => {
  it('should return null for valid usernames', () => {
    expect(usernamePatternValidator(ctrl('john_doe-01'))).toBeNull();
    expect(usernamePatternValidator(ctrl('ABC'))).toBeNull();
  });

  it('should return error for usernames with spaces or symbols', () => {
    expect(usernamePatternValidator(ctrl('john doe'))).toEqual({ usernamePattern: true });
    expect(usernamePatternValidator(ctrl('user@name'))).toEqual({ usernamePattern: true });
    expect(usernamePatternValidator(ctrl('user!name'))).toEqual({ usernamePattern: true });
  });

  it('should return null for empty value', () => {
    expect(usernamePatternValidator(ctrl(''))).toBeNull();
  });
});

describe('hasUppercaseValidator', () => {
  it('should return null when an uppercase letter is present', () => {
    expect(hasUppercaseValidator(ctrl('Abcdef1@'))).toBeNull();
  });

  it('should return error when no uppercase letter', () => {
    expect(hasUppercaseValidator(ctrl('abcdef1@'))).toEqual({ hasUppercase: true });
  });

  it('should return null for empty value', () => {
    expect(hasUppercaseValidator(ctrl(''))).toBeNull();
  });
});

describe('hasLowercaseValidator', () => {
  it('should return null when a lowercase letter is present', () => {
    expect(hasLowercaseValidator(ctrl('ABCDEf1@'))).toBeNull();
  });

  it('should return error when no lowercase letter', () => {
    expect(hasLowercaseValidator(ctrl('ABCDEF1@'))).toEqual({ hasLowercase: true });
  });

  it('should return null for empty value', () => {
    expect(hasLowercaseValidator(ctrl(''))).toBeNull();
  });
});

describe('hasNumberValidator', () => {
  it('should return null when a digit is present', () => {
    expect(hasNumberValidator(ctrl('Abcdef1@'))).toBeNull();
  });

  it('should return error when no digit', () => {
    expect(hasNumberValidator(ctrl('Abcdefg@'))).toEqual({ hasNumber: true });
  });

  it('should return null for empty value', () => {
    expect(hasNumberValidator(ctrl(''))).toBeNull();
  });
});

describe('hasSpecialCharValidator', () => {
  it('should return null when a special character is present', () => {
    expect(hasSpecialCharValidator(ctrl('Abcdef1@'))).toBeNull();
    expect(hasSpecialCharValidator(ctrl('Abcdef1!'))).toBeNull();
    expect(hasSpecialCharValidator(ctrl('Abcdef1#'))).toBeNull();
  });

  it('should return error when no special character', () => {
    expect(hasSpecialCharValidator(ctrl('Abcdef12'))).toEqual({ hasSpecialChar: true });
  });

  it('should return null for empty value', () => {
    expect(hasSpecialCharValidator(ctrl(''))).toBeNull();
  });
});
