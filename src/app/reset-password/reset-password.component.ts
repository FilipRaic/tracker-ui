import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../service/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    NgClass
  ],
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  submitted = false;

  private token: string | null = null;

  constructor(
    private readonly router: Router,
    public readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    if (!this.activatedRoute.snapshot.params['token']) {
      this.router.navigate(['/']).then();
      return;
    }

    this.token = this.activatedRoute.snapshot.params['token'];
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });

    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({passwordMismatch: true});
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.authService.resetPassword({
      password: this.f['password'].value,
      confirmPassword: this.f['confirmPassword'].value
    }, this.token!);
  }
}
