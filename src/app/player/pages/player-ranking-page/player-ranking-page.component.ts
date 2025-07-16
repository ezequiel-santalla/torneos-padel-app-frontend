import { Component, inject, signal, computed, effect } from '@angular/core';
import { PlayerRankingService } from '../../services/player-ranking.service';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RankingListComponent } from './ranking-list/ranking-list.component';
import { DropDownComponent } from '../../../shared/components/drop-down/drop-down.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-player-ranking-page',
  imports: [DropDownComponent, RankingListComponent],
  templateUrl: './player-ranking-page.component.html',
})
export class PlayerRankingPageComponent {

  playerRankingService = inject(PlayerRankingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Señales para los filtros del dropdown
  selectedGender = signal<string>('');
  selectedCategory = signal<string>('');

  // Computed signal que combina todos los filtros
  private filters = computed(() => ({
    gender: this.selectedGender(),
    category: this.selectedCategory()
  }));

  // rxResource que se actualiza reactivamente cuando cambian los filtros
  playerRankingResource = rxResource({
    params: () => this.filters(),
    stream: ({ params: filters }) => {
      return this.playerRankingService.getRanking(
        filters.gender || undefined,
        filters.category || undefined,
      );
    },
  });

  constructor() {
    // Efecto solo para actualizar URL
    effect(() => {
      this.updateUrl();
    });

    // Suscripción a los parámetros de la URL
    this.route.queryParams
      .pipe(takeUntilDestroyed())
      .subscribe(params => {
        // Actualizar señales basado en los parámetros de la URL
        this.selectedGender.set(params['gender'] || '');
        this.selectedCategory.set(params['category'] || '');
      });
  }

  // Métodos para manejar los cambios en los dropdowns
  onGenderChange(value: string) {
    this.selectedGender.set(value);
  }

  onCategoryChange(value: string) {
    this.selectedCategory.set(value);
  }

  // Método para actualizar la URL con los filtros actuales
  private updateUrl() {
    const queryParams: any = {};

    if (this.selectedGender()) {
      queryParams.gender = this.selectedGender();
    }
    if (this.selectedCategory()) {
      queryParams.category = this.selectedCategory();
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace',
      replaceUrl: true
    });
  }

  // Método para limpiar filtros
  clearFilters() {
    this.selectedGender.set('');
    this.selectedCategory.set('');
  }
}
