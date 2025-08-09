import { Routes } from "@angular/router";
import { PlayerStandingPageComponent } from "./pages/player-standing-page/player-standing-page.component";

export const playerStandingRoutes: Routes = [
  {
    path: ':id',
    component: PlayerStandingPageComponent,
  },
];
