import { Component, inject, viewChild } from '@angular/core';
import { MatchService } from '../../services/match.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatchListComponent } from '../../components/list/match-list.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-matches-by-tournament-page',
  imports: [MatchListComponent],
  templateUrl: './matches-by-tournament-page.component.html',
})
export class MatchesByTournamentPageComponent {

  private matchService = inject(MatchService);
  private tournamentId = inject(ActivatedRoute).parent?.snapshot.params['id'] ?? '';

  // Referencia al componente hijo
  private matchListComponent = viewChild(MatchListComponent);

  matchResource = rxResource({
    params: () => ({ tournamentId: this.tournamentId }),
    stream: ({ params }) => {
      if (!params.tournamentId) return of([]);

      return this.matchService.getAllMatchesByTournament(params.tournamentId);
    }
  });

  updateMatchResult(event: { matchId: string; pair1Score: number; pair2Score: number }): void {
    this.matchService.updateMatchResult(this.tournamentId, event.matchId, {
      pair1Score: event.pair1Score,
      pair2Score: event.pair2Score
    }).subscribe({
      next: (updatedMatch) => {
        console.log('Match updated successfully:', updatedMatch);

        // Recargar los datos para obtener la lista actualizada
        this.matchResource.reload();

        // Indicar al componente hijo que la actualización fue exitosa
        this.matchListComponent()?.completeUpdate(true);
      },
      error: (error) => {
        console.error('Error updating match:', error);

        // Indicar al componente hijo que hubo un error
        this.matchListComponent()?.completeUpdate(false);
      }
    });
  }
}
