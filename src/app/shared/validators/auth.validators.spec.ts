import { FormControl } from '@angular/forms';
import {
  usernamePatternValidator,
  hasUppercaseValidator,
  hasLowercaseValidator,
  hasNumberValidator,
  hasSpecialCharValidator,
  namePatternValidator,
  emailFormatValidator,
  phoneValidator,
  localPhoneValidator,
} from './auth.validators';

const ctrl = (value: string) => new FormControl(value);

describe('usernamePatternValidator', () => {
  it('should return null for valid usernames', () => {
    expect(usernamePatternValidator(ctrl('john_doe-01'))).toBeNull();
    expect(usernamePatternValidator(ctrl('ABC'))).toBeNull();
  });

  it('should return error for spaces or symbols', () => {
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

describe('namePatternValidator', () => {
  it('should return null for simple names', () => {
    expect(namePatternValidator(ctrl('John'))).toBeNull();
    expect(namePatternValidator(ctrl('Smith'))).toBeNull();
  });

  it('should return null for international and compound names', () => {
    expect(namePatternValidator(ctrl("O'Brien"))).toBeNull();
    expect(namePatternValidator(ctrl('Mary-Jane'))).toBeNull();
    expect(namePatternValidator(ctrl('José'))).toBeNull();
    expect(namePatternValidator(ctrl('van der Berg'))).toBeNull();
  });

  it('should return error for names with digits or symbols', () => {
    expect(namePatternValidator(ctrl('John1'))).toEqual({ namePattern: true });
    expect(namePatternValidator(ctrl('John@'))).toEqual({ namePattern: true });
    expect(namePatternValidator(ctrl('John.'))).toEqual({ namePattern: true });
  });

  it('should return null for empty value', () => {
    expect(namePatternValidator(ctrl(''))).toBeNull();
  });
});

describe('emailFormatValidator', () => {
  it('should return null for valid email addresses', () => {
    expect(emailFormatValidator(ctrl('user@example.com'))).toBeNull();
    expect(emailFormatValidator(ctrl('first.last+tag@sub.domain.org'))).toBeNull();
    expect(emailFormatValidator(ctrl('user_123@my-domain.io'))).toBeNull();
  });

  it('should return error for invalid email addresses', () => {
    expect(emailFormatValidator(ctrl('a@b'))).toEqual({ emailFormat: true });
    expect(emailFormatValidator(ctrl('user@.com'))).toEqual({ emailFormat: true });
    expect(emailFormatValidator(ctrl('@domain.com'))).toEqual({ emailFormat: true });
    expect(emailFormatValidator(ctrl('nodomain'))).toEqual({ emailFormat: true });
    expect(emailFormatValidator(ctrl('missing@tld.'))).toEqual({ emailFormat: true });
  });

  it('should return null for empty value', () => {
    expect(emailFormatValidator(ctrl(''))).toBeNull();
  });
});

describe('phoneValidator', () => {
  it('should return null for valid phone numbers', () => {
    expect(phoneValidator(ctrl('+1 555 000 0000'))).toBeNull();
    expect(phoneValidator(ctrl('+44 20 7946 0958'))).toBeNull();
    expect(phoneValidator(ctrl('+351 912 345 678'))).toBeNull();
    expect(phoneValidator(ctrl('555-000-0000'))).toBeNull();
    expect(phoneValidator(ctrl('(555) 000-0000'))).toBeNull();
  });

  it('should return error for too short numbers', () => {
    expect(phoneValidator(ctrl('123'))).toEqual({ phoneFormat: true });
  });

  it('should return error for numbers with invalid characters', () => {
    expect(phoneValidator(ctrl('phone: 123'))).toEqual({ phoneFormat: true });
    expect(phoneValidator(ctrl('abc-def-ghij'))).toEqual({ phoneFormat: true });
  });

  it('should return null for empty value', () => {
    expect(phoneValidator(ctrl(''))).toBeNull();
  });
});

describe('localPhoneValidator', () => {
  it('should return null for valid local numbers', () => {
    expect(localPhoneValidator(ctrl('555 000 0000'))).toBeNull();
    expect(localPhoneValidator(ctrl('912 345 678'))).toBeNull();
    expect(localPhoneValidator(ctrl('1234'))).toBeNull();
    expect(localPhoneValidator(ctrl('555-000-0000'))).toBeNull();
  });

  it('should return error for numbers with letters', () => {
    expect(localPhoneValidator(ctrl('abc123'))).toEqual({ phoneFormat: true });
    expect(localPhoneValidator(ctrl('555abc'))).toEqual({ phoneFormat: true });
  });

  it('should return error for too short numbers', () => {
    expect(localPhoneValidator(ctrl('123'))).toEqual({ phoneFormat: true });
  });

  it('should return error for too long numbers', () => {
    expect(localPhoneValidator(ctrl('1234567890123456'))).toEqual({ phoneFormat: true });
  });

  it('should return null for empty value', () => {
    expect(localPhoneValidator(ctrl(''))).toBeNull();
  });
});
