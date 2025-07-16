import { Routes } from "@angular/router";
import { TournamentLayoutComponent } from "./layouts/TournamentLayout/TournamentLayout.component";
import { TournamentListPageComponent } from "./pages/tournament-list-page/tournament-list-page.component";
import { TournamentDetailPageComponent } from "./pages/tournament-detail-page/tournament-detail-page.component";
import { PairsByTournamentPageComponent } from "./pair/pages/pairs-by-tournament-page/pairs-by-tournament-page.component";
import { MatchesByTournamentPageComponent } from "./match/pages/matches-by-tournament-page/matches-by-tournament-page.component";
import { TournamentCreatePageComponent } from "./pages/tournament-create-page/tournament-create-page.component";
import { StandingsByTournamentPageComponent } from "./standing/pages/standings-by-tournament-page/standings-by-tournament-page.component";

export const tournamentRoutes: Routes = [
  {
    path: '',
    component: TournamentLayoutComponent,
    children: [
      {
        path: 'create',
        component: TournamentCreatePageComponent
      },
      {
        path: 'all',
        component: TournamentListPageComponent
      },
      {
        path: ':id',
        component: TournamentDetailPageComponent,
        children: [
          {
            path: 'edit',
            component: TournamentCreatePageComponent
          },
          {
            path: 'pairs',
            component: PairsByTournamentPageComponent
          },
          {
            path: 'matches',
            component: MatchesByTournamentPageComponent
          },
          {
            path: 'standings',
            component: StandingsByTournamentPageComponent
          },
        ]
      },
    ]
  },
];

