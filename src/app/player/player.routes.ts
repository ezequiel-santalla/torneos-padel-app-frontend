import { Routes } from "@angular/router";
import { PlayerLayoutComponent } from "./layouts/PlayerLayout/PlayerLayout.component";
import { PlayerCreatePageComponent } from "./pages/player-create-page/player-create-page.component";
import { PlayerListPageComponent } from "./pages/player-list-page/player-list-page.component";
import { PlayerRankingPageComponent } from "./pages/player-ranking-page/player-ranking-page.component";

export const playerRoutes: Routes = [
  {
    path: '',
    component: PlayerLayoutComponent,
    children: [
      {
        path: 'all',
        component: PlayerListPageComponent
      },
      {
        path: 'create',
        component: PlayerCreatePageComponent
      },
      {
        path: 'ranking',
        component: PlayerRankingPageComponent
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
    ]
  },
];

