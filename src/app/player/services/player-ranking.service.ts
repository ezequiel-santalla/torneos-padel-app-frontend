import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { PLAYER_RANKING_URLS } from '../../constants/api.constants';
import { PlayerRanking, PlayersRankResponse, RankingOptions } from '../interfaces/player-ranking.interface';

@Injectable({
  providedIn: 'root'
})
export class PlayerRankingService {

  private http = inject(HttpClient);

  private playerRankingsCache = new Map<string, PlayerRanking[]>();

  getRanking(options: RankingOptions): Observable<PlayerRanking[]> {
    const { gender, category } = options;

    let params = new HttpParams();

    if (gender && gender.trim()) {
      params = params.set('gender', gender);
    }

    if (category && category.trim()) {
      params = params.set('category', category);
    }

    const key = `playerRankings-${gender}-${category}`;

    if (this.playerRankingsCache.has(key)) {
      return of(this.playerRankingsCache.get(key)!);
    }

    return this.http.get<PlayerRanking[]>(PLAYER_RANKING_URLS.RANKINGS, {
      params
    }).pipe(
      tap(rankings => this.playerRankingsCache.set(key, rankings))
    );
  }
}
