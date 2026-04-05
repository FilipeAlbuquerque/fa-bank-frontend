import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { LucideAngularModule, Building2, ArrowLeft, User, Mail, Phone } from 'lucide-angular';
import {
  NAME_MIN, NAME_MAX, MESSAGE_MAX,
  namePatternValidator,
  emailFormatValidator,
  phoneValidator,
} from '../../../shared/validators/auth.validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    LucideAngularModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb     = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly icons = { Building2, ArrowLeft, User, Mail, Phone };

  readonly submitted = signal(false);
  readonly loading   = signal(false);

  readonly MESSAGE_MAX = MESSAGE_MAX;

  readonly form = this.fb.group({
    firstName: ['', [
      Validators.required,
      Validators.minLength(NAME_MIN),
      Validators.maxLength(NAME_MAX),
      namePatternValidator,
    ]],
    lastName: ['', [
      Validators.required,
      Validators.minLength(NAME_MIN),
      Validators.maxLength(NAME_MAX),
      namePatternValidator,
    ]],
    email: ['', [
      Validators.required,
      emailFormatValidator,
    ]],
    phone: ['', [
      Validators.required,
      phoneValidator,
    ]],
    message: ['', [
      Validators.maxLength(MESSAGE_MAX),
    ]],
  });

  get messageLength(): number {
    return this.form.get('message')!.value?.length ?? 0;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    // Simulate submission — real API call will be wired in a later task
    setTimeout(() => {
      this.loading.set(false);
      this.submitted.set(true);
    }, 1200);
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}
