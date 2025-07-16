import { Component, inject, signal } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { RouterLink } from '@angular/router';
import { PlusIconComponent } from "../../../icons/plus-icon/plus-icon.component";

@Component({
  selector: 'app-player-list-page',
  imports: [SearchInputComponent, PlayerListComponent, RouterLink, PlusIconComponent],
  templateUrl: './player-list-page.component.html',
})
export class PlayerListPageComponent {

  playerService = inject(PlayerService);
  sweetAlertService = inject(SweetAlertService);
  query = signal<string>('');

  playerResource = rxResource({
    stream: () => this.playerService.getAll()
  });

  async deletePlayer(playerId: string) {

    const player = this.playerResource.value()?.find(t => t.id === playerId);
    if (!player) return;

    const confirmed = await this.sweetAlertService.confirmDelete(player.name, 'jugador');

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
