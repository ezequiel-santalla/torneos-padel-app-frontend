import { Component, input } from '@angular/core';
import { Tournament } from '../../../interfaces/tournament.interface';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EnumLabelPipe } from '../../../pipes/enum-label.pipe';

@Component({
  selector: 'tournament-detail-information',
  imports: [RouterLink, DatePipe, EnumLabelPipe],
  templateUrl: './tournament-detail-information.component.html',
})
export class TournamentDetailInformationComponent {

  tournament = input.required<Tournament>();
}
