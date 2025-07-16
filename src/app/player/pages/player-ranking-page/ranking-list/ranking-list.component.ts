import { Component, computed, input } from '@angular/core';
import { PlayerRanking } from '../../../interfaces/player-ranking.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ranking-list',
  imports: [RouterLink],
  templateUrl: './ranking-list.component.html',
})
export class RankingListComponent {

  players = input<PlayerRanking[]>([]);
  errorMessage = input<string | null>();
  isLoading = input<boolean>(false);

  isEmpty = computed(() => this.players().length === 0);

  shouldShowList = computed(() =>
    !this.isLoading() && !this.errorMessage() && !this.isEmpty()
  );
}
