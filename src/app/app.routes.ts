import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { UnauthenticatedGuard } from './auth/guards/unauthenticated.guard';
import { MainLayoutComponent } from './shared/layouts/MainLayout/MainLayout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'tournaments',
        loadChildren: () => import('./tournament/tournament.routes').then(m => m.tournamentRoutes)
      },
      {
        path: 'players',
        loadChildren: () => import('./player/player.routes').then(m => m.playerRoutes)
      },
      {
        path: 'player-standings',
        loadChildren: () => import('./player/player-standings.routes').then(m => m.playerStandingRoutes)
      },
      {
        path: 'rankings',
        loadChildren: () => import('./player/rankings.routes').then(m => m.playerRankingRoutes)
      },
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
    canMatch: [UnauthenticatedGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
