import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtils } from '../../../utils/form-utils';
import { DocumentIconComponent } from "../../../icons/document-icon/document-icon.component";
import { PhoneIconComponent } from "../../../icons/phone-icon/phone-icon.component";
import { MailIconComponent } from "../../../icons/mail-icon/mail-icon.component";
import { PasswordIconComponent } from "../../../icons/password-icon/password-icon.component";
import { AddUserIconComponent } from "../../../icons/add-user-icon/add-user-icon.component";
import { ResetIconComponent } from "../../../icons/reset-icon/reset-icon.component";
import { UserIconComponent } from "../../../icons/user-icon/user-icon.component";
import { EnumService } from '../../../enum/services/enum.service';
import { EnumOption } from '../../../enum/interfaces/enum.interface';
import { EnumLabelPipe } from '../../../shared/pipes/enum-label.pipe';
import { AuthService } from '../../services/auth.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
  selector: 'register-page',
  imports: [
    ReactiveFormsModule,
    DocumentIconComponent,
    PhoneIconComponent,
    MailIconComponent,
    PasswordIconComponent,
    AddUserIconComponent,
    ResetIconComponent,
    UserIconComponent,
    EnumLabelPipe
  ],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent implements OnInit {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private enumService = inject(EnumService);
  private router = inject(Router);
  private sweetAlertService = inject(SweetAlertService);

  get pageTitle(): string {
    return 'Registro de Usuario';
  }

  get pageSubtitle(): string {
    return 'Completa los datos para crear tu cuenta';
  }

  get submitButtonText(): string {
    if (this.isSubmitting) {
      return 'Creando cuenta...';
    }
    return 'Crear Cuenta';
  }

  get cancelButtonText(): string {
    return 'Limpiar';
  }

  formUtils = FormUtils;

  isSubmitting = false;
  isLoadingEnums = true;
  genderOptions: EnumOption[] = [];

  myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    genderType: ['', [Validators.required]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    phoneNumber: ['', [Validators.required]],
  }, {
    validators: [
      FormUtils.isPasswordOneEqualsPasswordTwo('password', 'confirmPassword')
    ]
  });

  ngOnInit() {
    this.loadEnumOptions();
  }

  private loadEnumOptions() {
    this.isLoadingEnums = true;
    console.log('Iniciando carga de enums...');

    // Deshabilitar los campos de select mientras se cargan
    this.setSelectFieldsDisabled(true);

    this.enumService.getEnumValues('gender-types').subscribe({
      next: (data) => {
        console.log('Opciones de género recibidas:', data);
        this.genderOptions = data.filter(
          (option: EnumOption) =>
            option.value === 'MASCULINE' || option.value === 'FEMININE'
        );
        this.isLoadingEnums = false;
        this.setSelectFieldsDisabled(false);
      },
      error: (error) => {
        console.error('Error cargando opciones de enums:', error);
        this.isLoadingEnums = false;
        this.setSelectFieldsDisabled(false);

        // Mostrar error al usuario
        this.sweetAlertService.showError(
          'Error cargando datos',
          'No se pudieron cargar las opciones de género. Por favor, recarga la página.'
        );
      }
    });
  }

  private setSelectFieldsDisabled(disabled: boolean) {
    const selectFields = ['genderType'];

    selectFields.forEach(field => {
      const control = this.myForm.get(field);
      if (control) {
        disabled ? control.disable() : control.enable();
      }
    });
  }

  private resetForm() {
    this.myForm.reset();

    this.myForm.patchValue({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      lastName: '',
      genderType: '',
      dni: '',
      phoneNumber: ''
    });
  }

  async onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    // Obtener todos los valores del formulario (incluidos los disabled)
    const formValue = this.myForm.getRawValue();

    // SOLICITAR CONFIRMACIÓN ANTES DE PROCEDER
    const confirmed = await this.sweetAlertService.confirmCustomAction(
      '¿Crear cuenta?',
      `Se registrará la cuenta para ${formValue.name} ${formValue.lastName} con el email ${formValue.email}`,
      'Sí, crear cuenta',
      'Cancelar',
      'question'
    );

    if (!confirmed) {
      return; // El usuario canceló la acción
    }

    this.isSubmitting = true;

    // Mostrar loading
    this.sweetAlertService.showLoading(
      'Creando cuenta...',
      'Por favor espera mientras procesamos tu registro'
    );

    // El backend espera confirmPassword, así que lo mantenemos
    this.authService.register(formValue).subscribe({
      next: (response) => {
        console.log('Usuario registrado exitosamente:', response);
        this.isSubmitting = false;

        // Mostrar éxito
        this.sweetAlertService.showSuccess(
          '¡Cuenta creada exitosamente!',
          `Bienvenido/a ${response.player.name}! Tu cuenta ha sido creada correctamente.`
        );

        this.resetForm();
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Error registrando usuario:', error);
        this.isSubmitting = false;

        // Mostrar error
        this.sweetAlertService.showError(
          'Error al crear cuenta',
          'No se pudo crear la cuenta. Intenta nuevamente.'
        );
      }
    });
  }

  onCancel() {
    // En registro solo hay modo creación, así que siempre limpiar
    this.resetForm();
  }
}
