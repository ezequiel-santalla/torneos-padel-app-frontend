import { Component, inject, signal } from '@angular/core';
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

  matchResource = rxResource({
    params: () => ({ tournamentId: this.tournamentId }),
    stream: ({ params }) => {
      if (!params.tournamentId) return of([]);

      return this.matchService.getAllMatchesByTournament(params.tournamentId);
    }
  });
}

