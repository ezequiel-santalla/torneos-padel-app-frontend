import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PLAYER_STANDING_URLS } from '../../constants/api.constants';
import { PlayerStanding } from '../interfaces/player-standing.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerStandingService {

  private http = inject(HttpClient);

  getStandingsByPlayerId(id: string): Observable<PlayerStanding> {
    return this.http.get<PlayerStanding>(`${PLAYER_STANDING_URLS.STANDINGS}/${id}`);
  }
}
