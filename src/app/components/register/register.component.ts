import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  get passwordsMatch(): boolean {
    return this.registerForm.value.password === this.registerForm.value.confirmPassword;
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (!this.passwordsMatch) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { firstName, lastName, email, password } = this.registerForm.value;
      await this.authService.register({ firstName, lastName, email, password });
      this.router.navigateByUrl('/');
    } catch (error: any) {
      this.errorMessage =
        error?.error?.error || 'Registration failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
