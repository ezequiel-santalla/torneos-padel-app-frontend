import { Component, computed, input, output } from '@angular/core';
import { Tournament } from '../../../interfaces/tournament.interface';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EnumLabelPipe } from '../../../pipes/enum-label.pipe';

@Component({
  selector: 'tournament-list',
  imports: [RouterLink, DatePipe, EnumLabelPipe],
  templateUrl: './tournament-list.component.html',
})
export class TournamentListComponent {

  tournaments = input.required<Tournament[]>();
  errorMessage = input<string | null>();
  isLoading = input<boolean>(false);
  deleteTournament = output<string>();

  isEmpty = computed(() => this.tournaments().length === 0);

  shouldShowList = computed(() =>
    !this.isLoading() && !this.errorMessage() && !this.isEmpty()
  );

  onDeleteTournament(tournamentId: string) {
    this.deleteTournament.emit(tournamentId);
  }
}
