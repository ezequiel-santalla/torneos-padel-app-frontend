import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormUtils } from '../../../utils/form-utils';
import { MailIconComponent } from "../../../icons/mail-icon/mail-icon.component";
import { PasswordIconComponent } from "../../../icons/password-icon/password-icon.component";
import { UserIconComponent } from "../../../icons/user-icon/user-icon.component";
import { ResetIconComponent } from "../../../icons/reset-icon/reset-icon.component";
import { AuthService } from '../../services/auth.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule, MailIconComponent, PasswordIconComponent, UserIconComponent, ResetIconComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private sweetAlertService = inject(SweetAlertService);

  get pageTitle(): string {
    return 'Iniciar Sesión';
  }

  get pageSubtitle(): string {
    return 'Accede a tu cuenta';
  }

  get submitButtonText(): string {
    if (this.isSubmitting) {
      return 'Iniciando sesión...';
    }
    return 'Iniciar Sesión';
  }

  get cancelButtonText(): string {
    return 'Limpiar';
  }

  formUtils = FormUtils;

  isSubmitting = false;

  myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  private resetForm() {
    this.myForm.reset();

    this.myForm.patchValue({
      email: '',
      password: ''
    });
  }

  async onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const formValue = this.myForm.getRawValue();

    this.isSubmitting = true;

    this.sweetAlertService.showLoading(
      'Iniciando sesión...',
      'Por favor espera mientras verificamos tus credenciales'
    );

    this.authService.login(formValue).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.isSubmitting = false;

        const userName = this.authService.name() || 'Usuario';
        this.sweetAlertService.showSuccess(
          '¡Bienvenido!',
          `Hola ${userName}! Has iniciado sesión correctamente.`
        );

        this.resetForm();

        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.isSubmitting = false;

        const { title, message } = this.getErrorMessage(error);
        this.sweetAlertService.showError(title, message);
      }
    });
  }

  onCancel() {
    this.resetForm();
  }

  private getErrorMessage(error: any): { title: string, message: string } {
    switch (error.status) {
      case 401:
        return {
          title: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos. Por favor, verifica tus datos.'
        };
      case 404:
        return {
          title: 'Usuario no encontrado',
          message: 'No existe una cuenta asociada a este email.'
        };
      case 403:
        return {
          title: 'Acceso denegado',
          message: 'Tu cuenta podría estar bloqueada o inactiva.'
        };
      case 0:
        return {
          title: 'Sin conexión',
          message: 'No se puede conectar al servidor. Verifica tu conexión a internet.'
        };
      default:
        if (error.status >= 500) {
          return {
            title: 'Error del servidor',
            message: 'Error interno del servidor. Intenta más tarde.'
          };
        }
        return {
          title: 'Error al iniciar sesión',
          message: 'No se pudo iniciar sesión. Verifica tus credenciales.'
        };
    }
  }
}
