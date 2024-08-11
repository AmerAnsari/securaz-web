import { Component, signal, WritableSignal } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse, ReactiveForm, ReactiveFormData } from '@amirsavand/ngx-common';
import { AuthService } from '@services/auth.service';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatCardContent,
    MatCard,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatIconButton,
    MatIcon,
    MatSuffix,
    MatLabel,
    MatCardTitle,
    MatCardSubtitle,
    MatCardHeader,
    MatCardActions,
    MatButton,
    RouterLink,
    MatAnchor,
    MatTooltip,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {

  protected isPassword: WritableSignal<boolean> = signal(true);

  protected form: ReactiveForm<ReactiveFormData> = new ReactiveForm({
    form: this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    }),
    error: {},
    loading: false,
  });

  constructor(private readonly formBuilder: FormBuilder,
              private readonly authService: AuthService,
              private readonly matSnackBar: MatSnackBar) {
  }

  protected passwordToggle(event: MouseEvent): void {
    this.isPassword.set(!this.isPassword());
    event.stopPropagation();
  }

  protected submit(): void {
    this.form.loading = true;
    this.form.form.disable();
    this.form.error = {};
    this.authService.signIn(this.form.form.value).subscribe({
      error: (error: HttpErrorResponse): void => {
        this.form.form.enable();
        this.form.loading = false;
        this.form.error = error.error;
        if (this.form.error.detail) {
          this.matSnackBar.open(this.form.error.detail, '', {
            duration: 3000,
          });
        }
      },
    });
  }
}
