import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'tournaments',
    loadChildren: () => import('./tournament/tournament.routes').then(m => m.tournamentRoutes)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
