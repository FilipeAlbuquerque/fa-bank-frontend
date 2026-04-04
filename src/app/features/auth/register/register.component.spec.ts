import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [provideRouter([{ path: 'login', component: {} as never }])],
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
    expect(comp.form.invalid).toBe(true);
  });

  it('should require firstName with minimum 2 characters', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ firstName: 'A' });
    expect(comp.form.get('firstName')!.errors?.['minlength']).toBeTruthy();
  });

  it('should require a valid email', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ email: 'not-an-email' });
    expect(comp.form.get('email')!.errors?.['email']).toBeTruthy();
  });

  it('should require phone', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.patchValue({ phone: '' });
    expect(comp.form.get('phone')!.errors?.['required']).toBeTruthy();
  });

  it('should be valid when all required fields are filled', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '+1555000000',
      message: '',
    });
    expect(comp.form.valid).toBe(true);
  });

  it('should mark all fields as touched when submitting invalid form', () => {
    const { componentInstance: comp } = createComponent();
    comp.onSubmit();
    expect(comp.form.get('firstName')!.touched).toBe(true);
    expect(comp.form.get('email')!.touched).toBe(true);
  });

  it('should not change loading or submitted when form is invalid', () => {
    const { componentInstance: comp } = createComponent();
    comp.onSubmit();
    expect(comp.loading()).toBe(false);
    expect(comp.submitted()).toBe(false);
  });

  it('should set loading to true immediately after valid submit', () => {
    vi.useFakeTimers();
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '+1555000000',
      message: '',
    });

    comp.onSubmit();
    expect(comp.loading()).toBe(true);
    vi.useRealTimers();
  });

  it('should set submitted and clear loading after 1200ms', () => {
    vi.useFakeTimers();
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '+1555000000',
      message: '',
    });

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
