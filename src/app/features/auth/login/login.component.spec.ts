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

  it('should be invalid when username is too short', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ username: 'ab', password: 'validpassword' });
    expect(comp.username.errors?.['minlength']).toBeTruthy();
  });

  it('should be invalid when password is too short', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ username: 'validuser', password: '123' });
    expect(comp.password.errors?.['minlength']).toBeTruthy();
  });

  it('should be valid with correct credentials', () => {
    const { componentInstance: comp } = createComponent();
    comp.form.setValue({ username: 'validuser', password: 'validpassword' });
    expect(comp.form.valid).toBe(true);
  });

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

    comp.form.setValue({ username: 'validuser', password: 'validpassword' });
    comp.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      username: 'validuser',
      password: 'validpassword',
    });
  });

  it('should clear error message when submitting again', () => {
    authServiceMock.login.mockReturnValue(of({ token: 'tok', username: 'u', roles: [] }));
    const { componentInstance: comp } = createComponent();

    comp.form.setValue({ username: 'validuser', password: 'validpassword' });
    comp.onSubmit();

    expect(comp.errorMessage()).toBe('');
  });

  it('should set error message on 401 response', () => {
    authServiceMock.login.mockReturnValue(throwError(() => ({ status: 401 })));
    const { componentInstance: comp } = createComponent();

    comp.form.setValue({ username: 'validuser', password: 'wrongpass' });
    comp.onSubmit();

    expect(comp.errorMessage()).toContain('Invalid credentials');
    expect(comp.loading()).toBe(false);
  });

  it('should set locked message on 423 response', () => {
    authServiceMock.login.mockReturnValue(throwError(() => ({ status: 423 })));
    const { componentInstance: comp } = createComponent();

    comp.form.setValue({ username: 'validuser', password: 'validpassword' });
    comp.onSubmit();

    expect(comp.errorMessage()).toContain('temporarily locked');
  });

  it('should set generic error message on other errors', () => {
    authServiceMock.login.mockReturnValue(throwError(() => ({ status: 500 })));
    const { componentInstance: comp } = createComponent();

    comp.form.setValue({ username: 'validuser', password: 'validpassword' });
    comp.onSubmit();

    expect(comp.errorMessage()).toContain('Unable to connect');
  });
});
