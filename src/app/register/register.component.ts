import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../service/auth.service';
import {NotificationService} from '../service/notification.service';
import {NgClass, NgIf} from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink, TranslateModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    // Initialize the registration form
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });

    // Redirect to home if already logged in
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({passwordMismatch: true});
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.register({
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      confirmPassword: this.f['confirmPassword'].value
    }).subscribe({
      next: () => {
        this.translate.get('REGISTER.SUCCESS_MESSAGE').subscribe(translation => {
          this.notificationService.addNotification(translation, 'success');
        });
        this.router.navigate(['/login']);
      },
    });
  }
}
