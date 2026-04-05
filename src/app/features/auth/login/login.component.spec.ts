import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let authServiceMock: { login: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = { login: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideRouter([{ path: 'dashboard', component: {} as never }]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();
  });

  const createComponent = () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('should create', () => {
    expect(createComponent().componentInstance).toBeTruthy();
  });

  it('should initialise with empty form fields', () => {
    const { componentInstance: comp } = createComponent();
    expect(comp.username.value).toBe('');
    expect(comp.password.value).toBe('');
  });

  it('should be invalid when form is empty', () => {
    const { componentInstance: comp } = createComponent();
    expect(comp.form.invalid).toBe(true);
  });

  // ── Username validation ──────────────────────────────────

  it('should error when username is too short', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ username: 'ab', password: 'Valid1@pass' });
    expect(comp.username.errors?.['minlength']).toBeTruthy();
  });

  it('should error when username exceeds 30 characters', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ username: 'a'.repeat(31), password: 'Valid1@pass' });
    expect(comp.username.errors?.['maxlength']).toBeTruthy();
  });

  it('should error when username contains invalid characters', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ username: 'user name!', password: 'Valid1@pass' });
    expect(comp.username.errors?.['usernamePattern']).toBeTruthy();
  });

  it('should accept username with letters, digits, underscores and hyphens', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ username: 'valid_user-01', password: 'Valid1@pass' });
    expect(comp.username.valid).toBe(true);
  });

  // ── Password validation ──────────────────────────────────

  it('should error when password is too short', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ username: 'validuser', password: 'Sh0rt!' });
    expect(comp.password.errors?.['minlength']).toBeTruthy();
  });

  it('should error when password exceeds 64 characters', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ username: 'validuser', password: 'Valid1@' + 'a'.repeat(58) });
    expect(comp.password.errors?.['maxlength']).toBeTruthy();
  });

  it('should error when password has no uppercase letter', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ username: 'validuser', password: 'nouppercase1@' });
    expect(comp.password.errors?.['hasUppercase']).toBeTruthy();
  });

  it('should error when password has no lowercase letter', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ username: 'validuser', password: 'NOLOWERCASE1@' });
    expect(comp.password.errors?.['hasLowercase']).toBeTruthy();
  });

  it('should error when password has no number', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ username: 'validuser', password: 'NoNumber@abc' });
    expect(comp.password.errors?.['hasNumber']).toBeTruthy();
  });

  it('should error when password has no special character', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ username: 'validuser', password: 'NoSpecial123' });
    expect(comp.password.errors?.['hasSpecialChar']).toBeTruthy();
  });

  it('should be valid with a fully compliant password', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ username: 'validuser', password: 'Valid1@pass' });
    expect(comp.form.valid).toBe(true);
  });

  // ── Submit behaviour ─────────────────────────────────────

  it('should mark all fields as touched when submitting an invalid form', () => {
    const { componentInstance: comp } = createComponent();
    comp.onSubmit();
    expect(comp.username.touched).toBe(true);
    expect(comp.password.touched).toBe(true);
  });

  it('should not call login when form is invalid', () => {
    const { componentInstance: comp } = createComponent();
    comp.onSubmit();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call login with correct credentials on valid submit', () => {
    authServiceMock.login.mockReturnValue(of({ token: 'tok', username: 'u', roles: [] }));
    const { componentInstance: comp } = createComponent();

    comp.form.setValue({ username: 'validuser', password: 'Valid1@pass' });
    comp.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      username: 'validuser',
      password: 'Valid1@pass',
    });
  });

  it('should clear error message when submitting again', () => {
    authServiceMock.login.mockReturnValue(of({ token: 'tok', username: 'u', roles: [] }));
    const { componentInstance: comp } = createComponent();

    comp.form.setValue({ username: 'validuser', password: 'Valid1@pass' });
    comp.onSubmit();

    expect(comp.errorMessage()).toBe('');
  });

  it('should set error message on 401 response', () => {
    authServiceMock.login.mockReturnValue(throwError(() => ({ status: 401 })));
    const { componentInstance: comp } = createComponent();

    comp.form.setValue({ username: 'validuser', password: 'Valid1@pass' });
    comp.onSubmit();

    expect(comp.errorMessage()).toContain('Invalid credentials');
    expect(comp.loading()).toBe(false);
  });

  it('should set locked message on 423 response', () => {
    authServiceMock.login.mockReturnValue(throwError(() => ({ status: 423 })));
    const { componentInstance: comp } = createComponent();

    comp.form.setValue({ username: 'validuser', password: 'Valid1@pass' });
    comp.onSubmit();

    expect(comp.errorMessage()).toContain('temporarily locked');
  });

  it('should set generic error message on other errors', () => {
    authServiceMock.login.mockReturnValue(throwError(() => ({ status: 500 })));
    const { componentInstance: comp } = createComponent();

    comp.form.setValue({ username: 'validuser', password: 'Valid1@pass' });
    comp.onSubmit();

    expect(comp.errorMessage()).toContain('Unable to connect');
  });
});
