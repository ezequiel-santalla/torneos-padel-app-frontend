import { Component, inject, signal } from '@angular/core';
import { PairService } from '../../services/pair.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PairListComponent } from './list/pair-list.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-pairs-by-tournament-page',
  imports: [PairListComponent],
  templateUrl: './pairs-by-tournament-page.component.html',
})
export class PairsByTournamentPageComponent {

  private pairService = inject(PairService);
  private tournamentId = inject(ActivatedRoute).parent?.snapshot.params['id'] ?? '';

  pairResource = rxResource({
    params: () => ({ tournamentId: this.tournamentId }),
    stream: ({ params }) => {
      if (!params.tournamentId) return of([]);

      return this.pairService.getAllPairsByTournament(params.tournamentId);
    }
  });
}

