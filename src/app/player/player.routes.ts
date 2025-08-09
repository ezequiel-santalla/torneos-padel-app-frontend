import { Routes } from "@angular/router";
import { PlayerCreatePageComponent } from "./pages/player-create-page/player-create-page.component";
import { PlayerListPageComponent } from "./pages/player-list-page/player-list-page.component";
import { PlayerRankingPageComponent } from "./pages/player-ranking-page/player-ranking-page.component";

export const playerRoutes: Routes = [
  {
    path: '',
    component: PlayerListPageComponent
  },
  {
    path: 'create',
    component: PlayerCreatePageComponent
  },
  {
    path: ':id',
    children: [
      {
        path: 'edit',
        component: PlayerCreatePageComponent
      }
    ]
  }
];

