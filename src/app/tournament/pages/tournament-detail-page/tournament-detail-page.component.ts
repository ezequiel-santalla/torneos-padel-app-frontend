import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TournamentService } from '../../services/tournament.service';
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { TournamentDetailInformationComponent } from "./tournament-detail-information/tournament-detail-information.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-tournament-page',
  imports: [RouterOutlet, TournamentDetailInformationComponent, NotFoundComponent],
  templateUrl: './tournament-detail-page.component.html',
})
export class TournamentDetailPageComponent {

  private route = inject(ActivatedRoute);
  private tournamentService = inject(TournamentService);

  tournamentResource = rxResource({
    params: () => {
      const id = this.route.snapshot.paramMap.get('id');
      return { id };
    },
    stream: ({ params }) => {
      if (!params.id) return of(null);

      return this.tournamentService.getById(params.id);
    }
  });

  isRootRoute = () => {
    return this.route.snapshot.children.length === 0;
  };
}
