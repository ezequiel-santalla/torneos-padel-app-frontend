import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form-utils';
import { ResetIconComponent } from '../../../../icons/reset-icon/reset-icon.component';
import { ConfirmIconComponent } from '../../../../icons/confirm-icon/confirm-icon.component';
import { PlayerService } from '../../../services/player.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EnumService } from '../../../../enum/services/enum.service';
import { forkJoin } from 'rxjs';
import { EnumOption } from '../../../../enum/interfaces/enum.interface';
import { EnumLabelPipe } from '../../../../shared/pipes/enum-label.pipe';
import { Player } from '../../../interfaces/player.interface';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'player-edit-form',
  imports: [ReactiveFormsModule, ResetIconComponent, ConfirmIconComponent, EnumLabelPipe],
  templateUrl: './player-edit-form.component.html',
})
export class PlayerEditFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private playerService = inject(PlayerService);
  private enumService = inject(EnumService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private sweetAlertService = inject(SweetAlertService);

  get submitButtonText(): string {
    if (this.isSubmitting) {
      return 'Actualizando...';
    }
    return 'Actualizar Jugador';
  }

  // Getters para el template
  get isPlayerMasculine(): boolean {
    return this.currentPlayer?.genderType === 'MASCULINE';
  }

  get isPlayerFeminine(): boolean {
    return this.currentPlayer?.genderType === 'FEMININE';
  }

  get playerAlt(): string {
    return this.currentPlayer
      ? `${this.currentPlayer.name} ${this.currentPlayer.lastName}`
      : 'Avatar del jugador';
  }

  formUtils = FormUtils;

  isSubmitting = false;
  isLoadingEnums = true;
  playerId: string | null = null;
  currentPlayer: Player | null = null;

  genderOptions: EnumOption[] = [];

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    dni: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    genderType: ['', [Validators.required]]
  });

  ngOnInit() {
    this.checkPlayerId();
    this.loadEnumOptions();
  }

  private checkPlayerId() {
    this.playerId = this.route.snapshot.paramMap.get('id');

    if (!this.playerId) {
      console.error('Player ID not found in route');
      this.router.navigate(['/players']);
    }
  }

  private loadEnumOptions() {
    this.isLoadingEnums = true;

    // Deshabilitar los campos de select mientras se cargan
    this.setSelectFieldsDisabled(true);

    forkJoin({
      genders: this.enumService.getEnumValues('gender-types')
    }).subscribe({
      next: (data) => {
        this.genderOptions = data.genders;

        this.isLoadingEnums = false;
        this.setSelectFieldsDisabled(false);

        // Cargar los datos del jugador
        if (this.playerId) {
          this.loadPlayerData(this.playerId);
        }
      },
      error: (error) => {
        console.error('Error cargando opciones de enums:', error);
        this.isLoadingEnums = false;
        this.setSelectFieldsDisabled(false);
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
          'No se pudo cargar la información del jugador'
        );
        this.router.navigate(['/players']);
      }
    });
  }

  private populateForm(player: Player) {
    this.myForm.patchValue({
      name: player.name,
      lastName: player.lastName,
      dni: player.dni,
      phoneNumber: player.phoneNumber,
      genderType: player.genderType || ''
    });
  }

  async onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    if (!this.playerId) {
      console.error('Player ID not found');
      return;
    }

    // Obtener todos los valores del formulario (incluidos los disabled)
    const formValue = this.myForm.getRawValue();

    // SOLICITAR CONFIRMACIÓN ANTES DE PROCEDER
    const confirmed = await this.sweetAlertService.confirmPlayerAction(
      true, // isEditMode = true
      `${formValue.name} ${formValue.lastName}`
    );

    if (!confirmed) {
      return; // El usuario canceló la acción
    }

    this.isSubmitting = true;

    // Mostrar loading
    this.sweetAlertService.showLoading(
      'Actualizando jugador...',
      'Por favor espera mientras procesamos la información'
    );

    this.playerService.update(this.playerId, formValue).subscribe({
      next: (updatedPlayer) => {
        this.isSubmitting = false;
        this.currentPlayer = updatedPlayer;

        // Mostrar éxito
        this.sweetAlertService.showSuccess(
          '¡Jugador actualizado!',
          'La información del jugador ha sido actualizada exitosamente'
        );

        // Redirigir a los jugadores
        this.router.navigate(['/players']);
      },
      error: (error) => {
        console.error('Error actualizando jugador:', error);
        this.isSubmitting = false;

        // Mostrar error específico basado en el tipo de error
        let errorMessage = 'No se pudo actualizar el jugador. Intenta nuevamente.';

        if (error.status === 409) {
          errorMessage = 'Ya existe un jugador con ese DNI.';
        } else if (error.status === 400) {
          errorMessage = 'Los datos ingresados no son válidos.';
        }

        this.sweetAlertService.showError(
          'Error al actualizar',
          errorMessage
        );
      }
    });
  }

  onCancel() {
    this.router.navigate(['/players']);
  }
}
