import { Routes } from "@angular/router";
import { TournamentLayoutComponent } from "./layouts/TournamentLayout/TournamentLayout.component";
import { TournamentListPageComponent } from "./pages/tournament-list-page/tournament-list-page.component";
import { TournamentDetailPageComponent } from "./pages/tournament-detail-page/tournament-detail-page.component";
import { PairsByTournamentPageComponent } from "./pair/pages/pairs-by-tournament-page/pairs-by-tournament-page.component";
import { MatchesByTournamentPageComponent } from "./match/pages/matches-by-tournament-page/matches-by-tournament-page.component";
import { TournamentCreatePageComponent } from "./pages/tournament-create-page/tournament-create-page.component";

export const tournamentRoutes: Routes = [
  {
    path: '',
    component: TournamentLayoutComponent,
    children: [
      {
        path: 'all',
        component: TournamentListPageComponent
      },
      {
        path: ':id',
        component: TournamentDetailPageComponent,
        children: [
          {
            path: 'pairs',
            component: PairsByTournamentPageComponent
          },
          {
            path: 'matches',
            component: MatchesByTournamentPageComponent
          }
        ]
      },
      {
        path: 'create',
        component: TournamentCreatePageComponent
      }
    ]
  },
];

