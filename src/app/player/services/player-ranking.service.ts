import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PlayerRanking } from '../interfaces/player-ranking.interface';
import { Observable } from 'rxjs';
import { PLAYER_RANKING_URLS } from '../../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class PlayerRankingService {

  private http = inject(HttpClient);

  getRanking(gender?: string, category?: string): Observable<PlayerRanking[]> {
    let params = new HttpParams();

    if (gender) params = params.set('gender', gender);
    if (category) params = params.set('category', category);

    return this.http.get<PlayerRanking[]>(PLAYER_RANKING_URLS.RANKINGS, { params });
  }
}
