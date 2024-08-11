import { Component, inject, OnDestroy, OnInit, signal, TemplateRef, WritableSignal } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '@modules/header/header.component';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { ApiResponse, findItemInList, ReactiveForm, removeChild } from '@amirsavand/ngx-common';
import { ApiService } from '@services/api.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Credential } from '@interfaces/credential';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatActionList, MatListItem, MatListItemAvatar } from '@angular/material/list';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-credential',
  standalone: true,
  imports: [
    HeaderComponent,
    MatFabButton,
    MatIcon,
    MatProgressSpinner,
    MatTooltip,
    MatButton,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatDialogClose,
    MatActionList,
    MatListItem,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatSuffix,
    CdkCopyToClipboard,
    MatListItemAvatar,
  ],
  templateUrl: './credential.component.html',
  styleUrl: './credential.component.scss',
})
export class CredentialComponent implements OnInit, OnDestroy {

  /** Subscription to destroy the observables to avoid unnecessary subscriptions. */
  private readonly subscriptions: Subscription = new Subscription();

  /** Material dialog injection. */
  readonly dialog: MatDialog = inject(MatDialog);

  protected isPassword: WritableSignal<boolean> = signal(true);

  /** Material dialog reference. */
  protected dialogRef!: MatDialogRef<TemplateRef<any>>;

  /** List of items. */
  protected items: Credential[] = [];

  /** Api loading indicator. */
  protected loading = true;

  /** Credential form. */
  protected form: ReactiveForm<Credential> = new ReactiveForm<Credential>({
    form: this.formBuilder.group({
      password: [],
      site: [],
      username: [],
      note: [],
    }),
    error: {},
    crud: this.apiService.credential,
    viewMode: false,
  });

  constructor(private readonly apiService: ApiService,
              private readonly formBuilder: FormBuilder,
              private readonly authService: AuthService,
              private readonly matSnackBar: MatSnackBar,
              private readonly router: Router) {
  }

  private siteIcon(site: string): string {
    const client: string = 'PASSWORD_MANAGER';
    const type: string = 'FAVICON';
    const fallback: string = 'TYPE,SIZE,URL,TOP_DOMAIN';
    const size: number = 64;
    return `https://t1.gstatic.com/faviconV2?client=${client}&type=${type}&fallback_opts=${fallback}&size=${size}&url=${site}`;
  }

  protected copiedToClipboard(): void {
    this.matSnackBar.open('Password copied to clipboard', '', {
      duration: 3000,
    });
  }

  protected passwordToggle(event: MouseEvent): void {
    this.isPassword.set(!this.isPassword());
    event.stopPropagation();
  }

  protected openDialog(templateRef: TemplateRef<any>, item?: Credential): void {
    if (item) {
      this.form.patch(item);
      this.form.viewMode = true;
      this.form.form.disable();
    }
    this.dialogRef = this.dialog.open(templateRef, {
      width: '576px',
    });
    this.dialogRef.afterClosed().subscribe({
      next: (): void => {
        this.form.reset(true, true);
        this.form.form.reset();
        this.form.form.enable();
        this.form.viewMode = false;
      },
    });
  }

  protected destroy(templateRef: TemplateRef<any>): void {
    const dialogRef: MatDialogRef<any> = this.dialog.open(templateRef);
    dialogRef.afterClosed().subscribe({
      next: (data: boolean): void => {
        if (data && this.form.crud && this.form.id) {

          /** Disable the form. */
          this.form.form.disable();

          /** Prevent to close the dialog. */
          this.dialogRef.disableClose = true;

          this.form.crud.destroy(this.form.id).subscribe({
            next: (): void => {

              /** Enable back the form. */
              this.form.form.enable();

              /** Allow to close the dialog. */
              this.dialogRef.disableClose = false;

              /** Success message. */
              this.matSnackBar.open('Credential deleted', '', {
                duration: 3000,
              });

              /** Close the dialog. */
              this.dialogRef.close();

              /** Remove from list. */
              if (this.form.data) {
                removeChild<Credential>(this.items, this.form.data);
              }
            },
          });
        }
      },
    });
  }

  protected submit(): void {

    /** Disable the form. */
    this.form.form.disable();

    /** Prevent to close the dialog. */
    this.dialogRef.disableClose = true;

    /** Clear the form error. */
    this.form.error = {};

    /** Whether it's create or edit mode. */
    const isCreate: boolean = this.form.isCreate;

    /** Submit the form. */
    this.form.submit().subscribe({
      next: (data: Credential): void => {

        /** Add the site icon. */
        data.site_icon = this.siteIcon(data.site);

        /** Push to the items. */
        if (isCreate) {
          this.items.unshift(data);
        }

        /** Update the item in the list. */
        else {
          const credential: Credential | undefined = findItemInList(this.items, data.id);
          if (credential) {
            Object.assign(credential, data);
          }
        }

        /** Enable back the form. */
        this.form.form.enable();

        /** Allow to close the dialog. */
        this.dialogRef.disableClose = false;

        /** Success message. */
        this.matSnackBar.open('Credential saved', '', {
          duration: 3000,
        });

        /** Close the dialog. */
        this.dialogRef.close();
      },
      error: (): void => {

        /** Enable back the form. */
        this.form.form.enable();

        /** Allow to close the dialog. */
        this.dialogRef.disableClose = false;
      },
    });
  }

  protected signOut(): void {
    this.authService.signOut();
  }

  ngOnInit(): void {
    if (!AuthService.isAuth()) {
      this.router.navigateByUrl(AuthService.SIGN_OUT_REDIRECT);
    }

    /** Get the items. */
    else {
      this.subscriptions.add(
        this.apiService.credential.list().subscribe({
          next: (data: ApiResponse<Credential>): void => {
            this.items = data.results;
            for (let item of this.items) {
              item.site_icon = this.siteIcon(item.site);
            }
            this.loading = false;
          },
        }),
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
