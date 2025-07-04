import { Component, inject } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';

@Component({
  selector: 'app-tournament-create-page',
  imports: [],
  templateUrl: './tournament-create-page.component.html',
})
export class TournamentCreatePageComponent {

  tournamentService = inject(TournamentService);
}
