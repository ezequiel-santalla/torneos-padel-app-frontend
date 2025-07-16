import { Component, input } from '@angular/core';
import { PlayerStanding } from '../../../interfaces/player-standing.interface';
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'player-standing-information',
  imports: [PercentPipe],
  templateUrl: './player-standing-information.component.html',
})
export class PlayerStandingInformationComponent {

  playerStanding = input.required<PlayerStanding>();
}
