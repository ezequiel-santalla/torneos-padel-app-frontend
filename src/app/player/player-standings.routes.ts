import { Routes } from "@angular/router";
import { PlayerLayoutComponent } from "./layouts/PlayerLayout/PlayerLayout.component";
import { PlayerStandingPageComponent } from "./pages/player-standing-page/player-standing-page.component";

export const playerStandingRoutes: Routes = [
  {
    path: '',
    component: PlayerLayoutComponent,
    children: [
      {
        path: ':id',
        component: PlayerStandingPageComponent,
      },
    ]
  },
];
