import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { LucideAngularModule, Building2, ArrowLeft, User, Mail, Lock, Phone } from 'lucide-angular';

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
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly icons = { Building2, ArrowLeft, User, Mail, Lock, Phone };

  readonly submitted = signal(false);
  readonly loading = signal(false);

  readonly form = this.fb.group({
    firstName:  ['', [Validators.required, Validators.minLength(2)]],
    lastName:   ['', [Validators.required, Validators.minLength(2)]],
    email:      ['', [Validators.required, Validators.email]],
    phone:      ['', [Validators.required]],
    message:    [''],
  });

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
