import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Player, PlayerOptions, PlayersResponse } from '../interfaces/player.interface';
import { delay, Observable, of, tap } from 'rxjs';
import { PLAYER_URLS } from '../../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private http = inject(HttpClient);

  private playersCache = new Map<string, PlayersResponse>();
  private playerCache = new Map<string, Player>();

  getAll(options: PlayerOptions): Observable<PlayersResponse> {
    const { size = 8, page = 0 } = options;

    const key = `players-${page}-${size}`;

    if (this.playersCache.has(key)) {
      return of(this.playersCache.get(key)!);
    }

    return this.http.get<PlayersResponse>(PLAYER_URLS.PLAYERS, {
      params: {
        size: size,
        page: page
      }
    }).pipe(
      tap(resp => this.playersCache.set(key, resp))
    )
  }

  getById(id: string): Observable<Player> {
    if (this.playerCache.has(id)) {
      return of(this.playerCache.get(id)!);
    }

    return this.http.get<Player>(`${PLAYER_URLS.PLAYERS}/${id}`).pipe(
      tap(player => this.playerCache.set(id, player))
    );
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
