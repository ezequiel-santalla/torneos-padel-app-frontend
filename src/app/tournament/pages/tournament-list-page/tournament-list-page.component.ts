import { Component, inject, signal } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { TournamentListComponent } from './tournament-list/tournament-list.component';

@Component({
  selector: 'app-tournament-list-page',
  imports: [SearchInputComponent, TournamentListComponent],
  templateUrl: './tournament-list-page.component.html',
})
export class TournamentListPageComponent {

  tournamentService = inject(TournamentService);
  sweetAlertService = inject(SweetAlertService);
  query = signal<string>('');

  tournamentResource = rxResource({
    stream: () => this.tournamentService.getAll()
  });

  async deleteTournament(tournamentId: string) {

    const tournament = this.tournamentResource.value()?.find(t => t.id === tournamentId);
    if (!tournament) return;

    const confirmed = await this.sweetAlertService.confirmDelete(tournament.name, 'torneo');

    if (confirmed) {
      this.sweetAlertService.showLoading('Eliminando...', 'Por favor espera');

      this.tournamentService.delete(tournament.id).subscribe({
        next: () => {
          this.tournamentResource.reload();
          this.sweetAlertService.showSuccess(
            '¡Eliminado!',
            'El torneo ha sido eliminado exitosamente'
          );
        },
        error: (error) => {
          console.error('Error al eliminar torneo:', error);
          this.sweetAlertService.showError(
            'Error',
            'No se pudo eliminar el torneo. Intenta nuevamente.'
          );
        }
      });
    }
  }
}
