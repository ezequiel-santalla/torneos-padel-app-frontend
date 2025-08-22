import { Component, inject, signal } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { PaginationService } from '../../../shared/components/pagination/pagination.service';

@Component({
  selector: 'app-player-list-page',
  imports: [SearchInputComponent, PlayerListComponent, PaginationComponent],
  templateUrl: './player-list-page.component.html',
})
export class PlayerListPageComponent {

  playerService = inject(PlayerService);
  sweetAlertService = inject(SweetAlertService);
  paginationService = inject(PaginationService);
  query = signal<string>('');

  activatedRoute = inject(ActivatedRoute);

  readonly pageSize = 8;

  getGlobalIndex(localIndex: number): number {
    const currentPageZeroBased = this.paginationService.currentPage() - 1;

    return (currentPageZeroBased * this.pageSize) + localIndex + 1;
  }

  playerResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      search: this.query()
    }),
    stream: ({ params }) => {
      return this.playerService.getAll({
        size: 8,
        page: params.page,
      });
    }
  });

  async deletePlayer(playerId: string) {

    const player = this.playerResource.value()?.items.find(t => t.id === playerId);
    if (!player) return;

    const confirmed = await this.sweetAlertService.confirmDelete(`${player.name} ${player.lastName}`, 'jugador');

    if (confirmed) {
      this.sweetAlertService.showLoading('Eliminando...', 'Por favor espera');

      this.playerService.delete(player.id).subscribe({
        next: () => {
          this.playerResource.reload();
          this.sweetAlertService.showSuccess(
            '¡Eliminado!',
            'El jugador ha sido eliminado exitosamente'
          );
        },
        error: (error) => {
          console.error('Error al eliminar jugador:', error);
          this.sweetAlertService.showError(
            'Error',
            'No se pudo eliminar el jugador. Intenta nuevamente.'
          );
        }
      });
    }
  }
};
