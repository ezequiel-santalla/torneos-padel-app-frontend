import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PLAYER_STANDING_URLS } from '../../constants/api.constants';
import { PlayerStanding } from '../interfaces/player-standing.interface';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerStandingService {

  private http = inject(HttpClient);

  private playerStandingsCache = new Map<string, PlayerStanding>();

  getStandingsByPlayerId(id: string): Observable<PlayerStanding> {
    if (this.playerStandingsCache.has(id)) {
      return of(this.playerStandingsCache.get(id)!);
    }

    return this.http.get<PlayerStanding>(`${PLAYER_STANDING_URLS.STANDINGS}/${id}`).pipe(
      tap(standing => this.playerStandingsCache.set(id, standing))
    );
  }
}
