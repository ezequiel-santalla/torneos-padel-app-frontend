import { Routes } from "@angular/router";
import { PlayerListPageComponent } from "./pages/player-list-page/player-list-page.component";
import { PlayerEditFormComponent } from "./pages/player-edit-page/player-edit-form/player-edit-form.component";


export const playerRoutes: Routes = [
  {
    path: '',
    component: PlayerListPageComponent
  },
  {
    path: ':id',
    children: [
      {
        path: 'edit',
        component: PlayerEditFormComponent
      }
    ]
  }
];

