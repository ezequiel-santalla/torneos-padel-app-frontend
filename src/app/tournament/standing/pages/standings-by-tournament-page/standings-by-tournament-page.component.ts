import { Component, computed, inject } from '@angular/core';
import { StandingService } from '../../services/standing.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { StandingListComponent } from '../../components/list/standing-list/standing-list.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TournamentService } from '../../../services/tournament.service';
import { ProgressService } from '../../../progress/services/progress.service';

@Component({
  selector: 'app-matches-by-tournament-page',
  imports: [StandingListComponent],
  templateUrl: './standings-by-tournament-page.component.html',
})
export class StandingsByTournamentPageComponent {

  private standingService = inject(StandingService);
  private progressService = inject(ProgressService);
  private tournamentService = inject(TournamentService);
  private tournamentId = inject(ActivatedRoute).parent?.snapshot.params['id'] ?? '';

  standingResource = rxResource({
    params: () => ({ tournamentId: this.tournamentId }),
    stream: ({ params }) => {
      if (!params.tournamentId) return of([]);

      return this.standingService.getStandingsByTournament(params.tournamentId);
    }
  });

  progressResource = rxResource({
    params: () => ({ tournamentId: this.tournamentId }),
    stream: ({ params }) => {
      if (!params.tournamentId) return of(null);

      return this.progressService.getProgressByTournament(params.tournamentId);
    }
  });

  tournamentResource = rxResource({
    params: () => ({ tournamentId: this.tournamentId }),
    stream: ({ params }) => {
      if (!params.tournamentId) return of(null);
      return this.tournamentService.getById(params.tournamentId);
    }
  });

  isTournamentFinished = computed(() =>
    this.tournamentResource.value()?.status.value === 'FINISHED'
  );
}

