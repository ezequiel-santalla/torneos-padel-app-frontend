import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form-utils';
import { ClockIconComponent } from "../../../../icons/clock-icon/clock-icon.component";
import { ResetIconComponent } from "../../../../icons/reset-icon/reset-icon.component";
import { ConfirmIconComponent } from "../../../../icons/confirm-icon/confirm-icon.component";
import { PlayerService } from '../../../services/player.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EnumService } from '../../../../enum/services/enum.service';
import { EnumOption } from '../../../../enum/interfaces/enum.interface';
import { EnumLabelPipe } from '../../../../tournament/pipes/enum-label.pipe';
import { Player } from '../../../interfaces/player.interface';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'player-create-form',
  imports: [ReactiveFormsModule, ClockIconComponent, ResetIconComponent, ConfirmIconComponent, EnumLabelPipe],
  templateUrl: './player-create-form.component.html',
})
export class PlayerCreateFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private playerService = inject(PlayerService);
  private enumService = inject(EnumService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private sweetAlertService = inject(SweetAlertService);

  get pageTitle(): string {
    return this.isEditMode ? 'Editar Jugador' : 'Nuevo Jugador';
  }

  get pageSubtitle(): string {
    return this.isEditMode ? 'Modifica los datos del jugador' : 'Completa los datos del jugador';
  }

  get submitButtonText(): string {
    if (this.isSubmitting) {
      return this.isEditMode ? 'Actualizando...' : 'Creando...';
    }
    return this.isEditMode ? 'Actualizar Jugador' : 'Crear Jugador';
  }

  get cancelButtonText(): string {
    return this.isEditMode ? 'Cancelar' : 'Limpiar';
  }

  formUtils = FormUtils;

  isSubmitting = false;
  isLoadingEnums = true;
  isEditMode = false;
  playerId: string | null = null;
  currentPlayer: Player | null = null;

  genderOptions: EnumOption[] = [];

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
    genderType: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
  });

  ngOnInit() {
    this.checkEditMode();
    this.loadEnumOptions();
  }

  private checkEditMode() {
    const url = this.router.url;
    this.isEditMode = url.includes('/edit');

    if (this.isEditMode) {
      this.playerId = this.route.parent?.snapshot.paramMap.get('id') || null;
    }
  }

  private loadEnumOptions() {
    this.isLoadingEnums = true;

    // Deshabilitar el campo de género mientras se carga
    this.setSelectFieldsDisabled(true);

    this.enumService.getEnumValues('gender-types').subscribe({
      next: (genders) => {
        this.genderOptions = genders;
        this.isLoadingEnums = false;
        this.setSelectFieldsDisabled(false);

        // Si estamos en modo edición, cargar los datos del jugador
        if (this.isEditMode && this.playerId) {
          this.loadPlayerData(this.playerId);
        }
      },
      error: (error) => {
        console.error('Error cargando opciones de género:', error);
        this.isLoadingEnums = false;
        this.setSelectFieldsDisabled(false);
      }
    });
  }

  private setSelectFieldsDisabled(disabled: boolean) {
    const control = this.myForm.get('genderType');
    if (control) {
      disabled ? control.disable() : control.enable();
    }
  }

  private loadPlayerData(id: string) {
    this.playerService.getById(id).subscribe({
      next: (player: Player) => {
        this.currentPlayer = player;
        this.populateForm(player);
      },
      error: (error) => {
        console.error('Error loading player:', error);
        this.sweetAlertService.showError(
          'Error al cargar',
          'No se pudo cargar la información del jugador.'
        );
      }
    });
  }

  private populateForm(player: Player) {
    this.myForm.patchValue({
      name: player.name,
      lastName: player.lastName,
      dni: player.dni,
      genderType: player.genderType,
      phoneNumber: player.phoneNumber
    });
  }

  private resetForm() {
    this.myForm.reset();

    // Resetear el campo de género
    this.myForm.patchValue({
      genderType: ''
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
    const confirmed = await this.sweetAlertService.confirmPlayerAction(
      this.isEditMode,
      `${formValue.name} ${formValue.lastName}`
    );

    if (!confirmed) {
      return; // El usuario canceló la acción
    }

    this.isSubmitting = true;

    // Mostrar loading
    this.sweetAlertService.showLoading(
      this.isEditMode ? 'Actualizando jugador...' : 'Creando jugador...',
      'Por favor espera mientras procesamos la información'
    );

    if (this.isEditMode && this.playerId) {
      // Modo edición - actualizar jugador existente
      this.playerService.update(this.playerId, formValue).subscribe({
        next: () => {
          this.isSubmitting = false;

          // Mostrar éxito
          this.sweetAlertService.showSuccess(
            '¡Jugador actualizado!',
            'El jugador ha sido actualizado exitosamente'
          );

          // Redirigir al detalle del jugador
          this.router.navigate(['/players/all']);
        },
        error: (error) => {
          console.error('Error actualizando jugador:', error);
          this.isSubmitting = false;

          // Mostrar error
          this.sweetAlertService.showError(
            'Error al actualizar',
            'No se pudo actualizar el jugador. Intenta nuevamente.'
          );
        }
      });
    } else {
      // Modo creación - crear nuevo jugador
      this.playerService.create(formValue).subscribe({
        next: (createdPlayer) => {
          console.log('Jugador creado exitosamente:', createdPlayer);
          this.isSubmitting = false;

          // Mostrar éxito
          this.sweetAlertService.showSuccess(
            '¡Jugador creado!',
            'El jugador ha sido creado exitosamente'
          );

          this.resetForm();
          this.router.navigate(['/players/all']);
        },
        error: (error) => {
          console.error('Error creando jugador:', error);
          this.isSubmitting = false;

          // Mostrar error
          this.sweetAlertService.showError(
            'Error al crear',
            'No se pudo crear el jugador. Intenta nuevamente.'
          );
        }
      });
    }
  }

  onCancel() {
    if (this.isEditMode && this.playerId) {
      // Si estamos editando, volver al detalle del jugador
      this.router.navigate(['/players/all']);
    } else {
      // Si estamos creando, limpiar el formulario
      this.resetForm();
    }
  }
}
