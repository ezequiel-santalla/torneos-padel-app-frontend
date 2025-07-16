import { Component, computed, input, output } from '@angular/core';
import { Player } from '../../../interfaces/player.interface';
import { RouterLink } from '@angular/router';
import { EnumLabelPipe } from '../../../../tournament/pipes/enum-label.pipe';

@Component({
  selector: 'player-list',
  imports: [RouterLink, EnumLabelPipe],
  templateUrl: './player-list.component.html',
})
export class PlayerListComponent {

  players = input<Player[]>([]);
  errorMessage = input<string | null>();
  isLoading = input<boolean>(false);
  deletePlayer = output<string>();

  isEmpty = computed(() => this.players().length === 0);

  shouldShowList = computed(() =>
    !this.isLoading() && !this.errorMessage() && !this.isEmpty()
  );

  onDeletePlayer(playerId: string) {
    this.deletePlayer.emit(playerId);
  }
}
