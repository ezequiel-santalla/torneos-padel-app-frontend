import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { PlayerStandingService } from '../../services/player-standing.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { PlayerStandingInformationComponent } from './player-standing-information/player-standing-information.component';
import { NotFoundComponent } from '../../../shared/components/not-found/not-found.component';

@Component({
  selector: 'app-player-standing-page',
  imports: [RouterOutlet, PlayerStandingInformationComponent, NotFoundComponent],
  templateUrl: './player-standing-page.component.html',
})
export class PlayerStandingPageComponent {

  private route = inject(ActivatedRoute);
  private playerStandingService = inject(PlayerStandingService);

  playerStandingResource = rxResource({
    params: () => {
      const id = this.route.snapshot.paramMap.get('id');
      return { id };
    },
    stream: ({ params }) => {
      if (!params.id) return of(null);

      return this.playerStandingService.getStandingsByPlayerId(params.id);
    }
  });

  isRootRoute = () => {
    return this.route.snapshot.children.length === 0;
  };
}
