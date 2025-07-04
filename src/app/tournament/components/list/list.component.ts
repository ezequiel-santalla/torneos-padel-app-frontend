import { Component, computed, input } from '@angular/core';
import { Tournament } from '../../interfaces/tournament.interface';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tournament-list',
  imports: [RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './list.component.html',
})
export class ListComponent {

  tournaments = input.required<Tournament[]>();
  errorMessage = input<string | null>();
  isLoading = input<boolean>(false);

  isEmpty = computed(() => this.tournaments().length === 0);

  shouldShowList = computed(() =>
    !this.isLoading() && !this.errorMessage() && !this.isEmpty()
  );
}
