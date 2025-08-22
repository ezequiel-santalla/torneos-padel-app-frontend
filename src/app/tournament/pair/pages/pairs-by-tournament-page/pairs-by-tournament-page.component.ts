import { Component, inject } from '@angular/core';
import { PairService } from '../../services/pair.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PairListComponent } from './list/pair-list.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-pairs-by-tournament-page',
  imports: [PairListComponent],
  templateUrl: './pairs-by-tournament-page.component.html',
})
export class PairsByTournamentPageComponent {

  pairService = inject(PairService);
  sweetAlertService = inject(SweetAlertService);
  tournamentId = inject(ActivatedRoute).parent?.snapshot.params['id'] ?? '';

  pairResource = rxResource({
    params: () => ({ tournamentId: this.tournamentId }),
    stream: ({ params }) => {
      if (!params.tournamentId) return of([]);

      return this.pairService.getAllPairsByTournament(params.tournamentId);
    }
  });

  async deletePair(tournamentId: string, pairId: string) {
    const pair = this.pairResource.value()?.find(p => p.id === pairId);
    if (!pair) return;

    const confirmed = await this.sweetAlertService.confirmDelete(pair.teamName, 'pareja');

    if (confirmed) {
      this.sweetAlertService.showLoading('Eliminando...', 'Por favor espera');

      this.pairService.deletePairInTournament(tournamentId, pairId).subscribe({
        next: () => {
          this.pairResource.reload();
          this.sweetAlertService.showSuccess(
            '¡Eliminado!',
            'La pareja ha sido eliminada exitosamente'
          );
        },
        error: (error) => {
          console.error('Error al eliminar pareja:', error);
          this.sweetAlertService.showError(
            'Error',
            'No se pudo eliminar la pareja. Intenta nuevamente.'
          );
        }
      });
    }
  }
}
