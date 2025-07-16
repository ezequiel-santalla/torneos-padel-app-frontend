import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Player } from '../interfaces/player.interface';
import { Observable } from 'rxjs';
import { PLAYER_URLS } from '../../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private http = inject(HttpClient);

  getAll(): Observable<Player[]> {
    return this.http.get<Player[]>(PLAYER_URLS.PLAYERS);
  }

  getById(id: string): Observable<Player> {
    return this.http.get<Player>(`${PLAYER_URLS.PLAYERS}/${id}`);
  }

  create(player: Player): Observable<Player> {
    return this.http.post<Player>(PLAYER_URLS.PLAYERS, player);
  }

  update(id: string, player: Player): Observable<Player> {
    return this.http.put<Player>(`${PLAYER_URLS.PLAYERS}/${id}`, player);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${PLAYER_URLS.PLAYERS}/${id}`);
  }
}
