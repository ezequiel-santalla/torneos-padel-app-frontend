import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form-utils';
import { ClockIconComponent } from "../../../../icons/clock-icon/clock-icon.component";
import { ResetIconComponent } from "../../../../icons/reset-icon/reset-icon.component";
import { ConfirmIconComponent } from "../../../../icons/confirm-icon/confirm-icon.component";
import { TournamentService } from '../../../services/tournament.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EnumService } from '../../../../enum/services/enum.service';
import { forkJoin } from 'rxjs';
import { EnumOption } from '../../../../enum/interfaces/enum.interface';
import { EnumLabelPipe } from '../../../../shared/pipes/enum-label.pipe';
import { Tournament } from '../../../interfaces/tournament.interface';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'tournament-create-form',
  imports: [ReactiveFormsModule, ClockIconComponent, ResetIconComponent, ConfirmIconComponent, EnumLabelPipe],
  templateUrl: './tournament-create-form.component.html',
})
export class TournamentCreateFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private tournamentService = inject(TournamentService);
  private enumService = inject(EnumService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private sweetAlertService = inject(SweetAlertService);

  get pageTitle(): string {
    return this.isEditMode ? 'Editar Torneo' : 'Torneo de Padel';
  }

  get pageSubtitle(): string {
    return this.isEditMode ? 'Modifica los datos del torneo' : 'Completa los datos del torneo';
  }

  get submitButtonText(): string {
    if (this.isSubmitting) {
      return this.isEditMode ? 'Actualizando...' : 'Creando...';
    }
    return this.isEditMode ? 'Actualizar Torneo' : 'Crear Torneo';
  }

  get cancelButtonText(): string {
    return this.isEditMode ? 'Cancelar' : 'Limpiar';
  }

  formUtils = FormUtils;

  isSubmitting = false;
  isLoadingEnums = true;
  isEditMode = false;
  tournamentId: string | null = null;
  currentTournament: Tournament | null = null;

  categoryOptions: EnumOption[] = [];
  genderOptions: EnumOption[] = [];
  tournamentTypeOptions: EnumOption[] = [];
  winningMatchRuleOptions: EnumOption[] = [];

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    address: ['', [Validators.required]],
    winningMatchRule: ['', [Validators.required]],
    tournamentType: ['', [Validators.required]],
    categoryType: ['', [Validators.required]],
    genderType: ['', [Validators.required]],
  });

  ngOnInit() {
    this.checkEditMode();
    this.loadEnumOptions();
  }

  private checkEditMode() {
    const url = this.router.url;
    this.isEditMode = url.includes('/edit');

    if (this.isEditMode) {
      this.tournamentId = this.route.parent?.snapshot.paramMap.get('id') || null;
    }
  }

  private loadEnumOptions() {
    this.isLoadingEnums = true;

    // Deshabilitar los campos de select mientras se cargan
    this.setSelectFieldsDisabled(true);

    forkJoin({
      categories: this.enumService.getEnumValues('category-types'),
      genders: this.enumService.getEnumValues('gender-types'),
      tournamentTypes: this.enumService.getEnumValues('tournament-types'),
      winningRules: this.enumService.getEnumValues('winning-match-rule-types')
    }).subscribe({
      next: (data) => {
        this.categoryOptions = data.categories;
        this.genderOptions = data.genders;
        this.tournamentTypeOptions = data.tournamentTypes;
        this.winningMatchRuleOptions = data.winningRules;

        this.isLoadingEnums = false;
        this.setSelectFieldsDisabled(false);

        // Si estamos en modo edición, cargar los datos del torneo
        if (this.isEditMode && this.tournamentId) {
          this.loadTournamentData(this.tournamentId);
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
    const selectFields = ['winningMatchRule', 'tournamentType', 'categoryType', 'genderType'];

    selectFields.forEach(field => {
      const control = this.myForm.get(field);
      if (control) {
        disabled ? control.disable() : control.enable();
      }
    });
  }

  private loadTournamentData(id: string) {
    this.tournamentService.getById(id).subscribe({
      next: (tournament: Tournament) => {
        this.currentTournament = tournament;
        this.populateForm(tournament);
      },
      error: (error) => {
        console.error('Error loading tournament:', error);
      }
    });
  }

  private populateForm(tournament: Tournament) {
    this.myForm.patchValue({
      name: tournament.name,
      startDate: this.formatDateForInput(tournament.startDate),
      endDate: this.formatDateForInput(tournament.endDate),
      address: tournament.address,
      winningMatchRule: tournament.winningMatchRule,
      tournamentType: tournament.tournamentType,
      categoryType: tournament.categoryType,
      genderType: tournament.genderType
    });
  }

  private formatDateForInput(dateString: Date | string): string {
  // Asumir que las fechas del backend son locales
  const dateStr = typeof dateString === 'string' ? dateString : dateString.toISOString();

  // Validar formato
  if (!dateStr) {
    console.error('Invalid date provided:', dateString);
    return '';
  }

  // Si viene en formato ISO, extraer solo la parte de fecha y hora
  // sin convertir zonas horarias
  const match = dateStr.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  if (match) {
    return match[1];
  }

  // Fallback: formatear manualmente
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.error('Invalid date provided:', dateString);
    return '';
  }

  return date.toISOString().slice(0, 16);
}

  private resetForm() {
    this.myForm.reset();

    this.myForm.patchValue({
      winningMatchRule: '',
      tournamentType: '',
      categoryType: '',
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
    const confirmed = await this.sweetAlertService.confirmTournamentAction(
      this.isEditMode,
      formValue.name
    );

    if (!confirmed) {
      return; // El usuario canceló la acción
    }

    this.isSubmitting = true;

    // Mostrar loading
    this.sweetAlertService.showLoading(
      this.isEditMode ? 'Actualizando torneo...' : 'Creando torneo...',
      'Por favor espera mientras procesamos la información'
    );

    if (this.isEditMode && this.tournamentId) {
      // Modo edición - actualizar torneo existente
      this.tournamentService.update(this.tournamentId, formValue).subscribe({
        next: () => {
          this.isSubmitting = false;

          // Mostrar éxito
          this.sweetAlertService.showSuccess(
            '¡Torneo actualizado!',
            'El torneo ha sido actualizado exitosamente'
          );

          // Redirigir al detalle del torneo
          this.router.navigate(['/tournaments', this.tournamentId]);
        },
        error: (error) => {
          console.error('Error actualizando torneo:', error);
          this.isSubmitting = false;

          // Mostrar error
          this.sweetAlertService.showError(
            'Error al actualizar',
            'No se pudo actualizar el torneo. Intenta nuevamente.'
          );
        }
      });
    } else {
      // Modo creación - crear nuevo torneo
      this.tournamentService.create(formValue).subscribe({
        next: (createdTournament) => {
          console.log('Torneo creado exitosamente:', createdTournament);
          this.isSubmitting = false;

          // Mostrar éxito
          this.sweetAlertService.showSuccess(
            '¡Torneo creado!',
            'El torneo ha sido creado exitosamente'
          );

          this.resetForm();
          this.router.navigate(['/tournaments']);
        },
        error: (error) => {
          console.error('Error creando torneo:', error);
          this.isSubmitting = false;

          // Mostrar error
          this.sweetAlertService.showError(
            'Error al crear',
            'No se pudo crear el torneo. Intenta nuevamente.'
          );
        }
      });
    }
  }

  onCancel() {
    if (this.isEditMode && this.tournamentId) {
      // Si estamos editando, volver al detalle del torneo
      this.router.navigate(['/tournaments', this.tournamentId]);
    } else {
      // Si estamos creando, limpiar el formulario
      this.resetForm();
    }
  }
}
