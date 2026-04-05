import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { RegisterComponent } from './register.component';
import { DEFAULT_COUNTRY } from '../../../shared/data/countries.data';

const VALID_FORM = {
  firstName:   'John',
  lastName:    'Smith',
  email:       'john@example.com',
  countryCode: DEFAULT_COUNTRY,
  phoneNumber: '555 000 0000',
  message:     '',
};

describe('RegisterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        provideRouter([{ path: 'login', component: {} as never }]),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    }).compileComponents();
  });

  const createComponent = () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('should create', () => {
    expect(createComponent().componentInstance).toBeTruthy();
  });

  it('should initialise with submitted = false and loading = false', () => {
    const { componentInstance: comp } = createComponent();
    expect(comp.submitted()).toBe(false);
    expect(comp.loading()).toBe(false);
  });

  it('should be invalid when form is empty', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ firstName: '', lastName: '', email: '', phoneNumber: '', message: '' });
    expect(comp.form.invalid).toBe(true);
  });

  // ── First / Last name ────────────────────────────────────

  it('should error when firstName is too short', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ firstName: 'A' });
    expect(comp.form.get('firstName')!.errors?.['minlength']).toBeTruthy();
  });

  it('should error when firstName exceeds 50 characters', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ firstName: 'A'.repeat(51) });
    expect(comp.form.get('firstName')!.errors?.['maxlength']).toBeTruthy();
  });

  it('should error when firstName contains digits or symbols', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ firstName: 'John1' });
    expect(comp.form.get('firstName')!.errors?.['namePattern']).toBeTruthy();
  });

  it('should accept international first names', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ ...VALID_FORM, firstName: "O'Brien" });
    expect(comp.form.get('firstName')!.valid).toBe(true);
  });

  it('should accept hyphenated last names', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ ...VALID_FORM, lastName: 'Mary-Jane' });
    expect(comp.form.get('lastName')!.valid).toBe(true);
  });

  // ── Email ────────────────────────────────────────────────

  it('should error for a bare email without TLD', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ email: 'user@nodomain' });
    expect(comp.form.get('email')!.errors?.['emailFormat']).toBeTruthy();
  });

  it('should error for email without domain', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ email: 'user@.com' });
    expect(comp.form.get('email')!.errors?.['emailFormat']).toBeTruthy();
  });

  it('should accept a valid email', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue(VALID_FORM);
    expect(comp.form.get('email')!.valid).toBe(true);
  });

  // ── Phone ────────────────────────────────────────────────

  it('should error for a phone number that is too short', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ phoneNumber: '123' });
    expect(comp.form.get('phoneNumber')!.errors?.['phoneFormat']).toBeTruthy();
  });

  it('should error for a phone number with letters', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ phoneNumber: 'abc123' });
    expect(comp.form.get('phoneNumber')!.errors?.['phoneFormat']).toBeTruthy();
  });

  it('should accept a valid local phone number', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue(VALID_FORM);
    expect(comp.form.get('phoneNumber')!.valid).toBe(true);
  });

  it('countryCode should default to Portugal', () => {
    const { componentInstance: comp } = createComponent();
    expect(comp.form.get('countryCode')!.value?.code).toBe('PT');
  });

  it('onPhoneKeyDown should allow digit keys', () => {
    const { componentInstance: comp } = createComponent();
    const event = new KeyboardEvent('keydown', { key: '5' });
    const spy = vi.spyOn(event, 'preventDefault');
    comp.onPhoneKeyDown(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('onPhoneKeyDown should block letter keys', () => {
    const { componentInstance: comp } = createComponent();
    const event = new KeyboardEvent('keydown', { key: 'a' });
    const spy = vi.spyOn(event, 'preventDefault');
    comp.onPhoneKeyDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('onPhoneKeyDown should allow Backspace and Delete', () => {
    const { componentInstance: comp } = createComponent();
    const backspace = new KeyboardEvent('keydown', { key: 'Backspace' });
    const del = new KeyboardEvent('keydown', { key: 'Delete' });
    const spy1 = vi.spyOn(backspace, 'preventDefault');
    const spy2 = vi.spyOn(del, 'preventDefault');
    comp.onPhoneKeyDown(backspace);
    comp.onPhoneKeyDown(del);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('onPhoneKeyDown should allow Ctrl+C and Cmd+V shortcuts', () => {
    const { componentInstance: comp } = createComponent();
    const ctrlC = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true });
    const metaV = new KeyboardEvent('keydown', { key: 'v', metaKey: true });
    const spy1 = vi.spyOn(ctrlC, 'preventDefault');
    const spy2 = vi.spyOn(metaV, 'preventDefault');
    comp.onPhoneKeyDown(ctrlC);
    comp.onPhoneKeyDown(metaV);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  // ── Message ──────────────────────────────────────────────

  it('should error when message exceeds 500 characters', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ message: 'a'.repeat(501) });
    expect(comp.form.get('message')!.errors?.['maxlength']).toBeTruthy();
  });

  it('should accept an empty message', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue(VALID_FORM);
    expect(comp.form.get('message')!.valid).toBe(true);
  });

  it('messageLength should return correct character count', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ message: 'hello' });
    expect(comp.messageLength).toBe(5);
  });

  // ── Submit ───────────────────────────────────────────────

  it('should mark all fields as touched when submitting invalid form', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ firstName: '', lastName: '', email: '', phoneNumber: '', message: '' });
    comp.onSubmit();
    expect(comp.form.get('firstName')!.touched).toBe(true);
    expect(comp.form.get('email')!.touched).toBe(true);
  });

  it('should not change loading or submitted when form is invalid', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ firstName: '', lastName: '', email: '', phoneNumber: '', message: '' });
    comp.onSubmit();
    expect(comp.loading()).toBe(false);
    expect(comp.submitted()).toBe(false);
  });

  it('should set loading to true immediately after valid submit', () => {
    vi.useFakeTimers();
    const { componentInstance: comp } = createComponent();
    comp.form.setValue(VALID_FORM);
    comp.onSubmit();
    expect(comp.loading()).toBe(true);
    vi.useRealTimers();
  });

  it('should set submitted and clear loading after 1200ms', () => {
    vi.useFakeTimers();
    const { componentInstance: comp } = createComponent();
    comp.form.setValue(VALID_FORM);
    comp.onSubmit();
    vi.advanceTimersByTime(1200);
    expect(comp.loading()).toBe(false);
    expect(comp.submitted()).toBe(true);
    vi.useRealTimers();
  });

  it('backToLogin() should not throw', () => {
    const { componentInstance: comp } = createComponent();
    expect(() => comp.backToLogin()).not.toThrow();
  });
});
