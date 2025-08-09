import { Component, inject, signal, computed, effect } from '@angular/core';
import { PlayerRankingService } from '../../services/player-ranking.service';
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RankingListComponent } from './ranking-list/ranking-list.component';
import { DropDownComponent } from '../../../shared/components/drop-down/drop-down.component';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-player-ranking-page',
  imports: [DropDownComponent, RankingListComponent],
  templateUrl: './player-ranking-page.component.html',
})
export class PlayerRankingPageComponent {

  playerRankingService = inject(PlayerRankingService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  selectedGender = signal<string>('');
  selectedCategory = signal<string>('');

  shouldShowRanking = computed(() =>
    this.selectedGender() !== '' && this.selectedCategory() !== ''
  );

  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map(params => params.get('page') ? +params.get('page')! : 1),
      map(page => isNaN(page) ? 1 : page)
    ),
    {
      initialValue: 1,
    }
  );

  playerRankingResource = rxResource({
    params: () => ({
      page: this.currentPage() - 1,
      gender: this.selectedGender(),
      category: this.selectedCategory()
    }),
    stream: ({ params }) => {
      return this.playerRankingService.getRanking({
        page: params.page,
        gender: params.gender || undefined,
        category: params.category || undefined
      });
    }
  });

  constructor() {
    // Efecto para actualizar URL cuando cambian los filtros
    effect(() => {
      // Solo actualizar URL si hay cambios en los filtros (no en la carga inicial)
      if (this.selectedGender() !== '' || this.selectedCategory() !== '') {
        this.updateUrl();
      }
    });

    // Suscripción a los parámetros de la URL para inicializar filtros
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed())
      .subscribe(params => {
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
    const queryParams: { [key: string]: string } = {};

    if (this.selectedGender()) {
      queryParams['gender'] = this.selectedGender();
    }
    if (this.selectedCategory()) {
      queryParams['category'] = this.selectedCategory();
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge', // Cambiado a 'merge' para preservar otros parámetros como page
      replaceUrl: true
    });
  }

  // Método para limpiar filtros
  clearFilters() {
    this.selectedGender.set('');
    this.selectedCategory.set('');

    // Actualizar URL eliminando los filtros
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        gender: null,
        category: null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
