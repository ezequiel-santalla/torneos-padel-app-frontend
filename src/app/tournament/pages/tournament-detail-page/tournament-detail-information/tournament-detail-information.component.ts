import { Component, input } from '@angular/core';
import { Tournament } from '../../../interfaces/tournament.interface';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tournament-detail-information',
  imports: [RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './tournament-detail-information.component.html',
})
export class TournamentDetailInformationComponent {

  tournament = input.required<Tournament>();
}
