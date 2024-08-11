import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse, ReactiveForm, ReactiveFormData } from '@amirsavand/ngx-common';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    FormsModule,
    MatAnchor,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {

  protected form: ReactiveForm<ReactiveFormData> = new ReactiveForm({
    form: this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    }),
    error: {},
    loading: false,
  });

  constructor(private readonly formBuilder: FormBuilder,
              private readonly authService: AuthService) {
  }

  protected submit(): void {
    this.form.loading = true;
    this.form.form.disable();
    this.form.error = {};
    this.authService.signUp(this.form.form.value).subscribe({
      error: (error: HttpErrorResponse): void => {
        this.form.loading = false;
        this.form.form.enable();
        this.form.error = error.error;
      },
    });
  }
}
