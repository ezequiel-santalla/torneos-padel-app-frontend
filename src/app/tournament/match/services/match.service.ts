import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Match } from '../interfaces/match.interface';
import { TOURNAMENT_URLS } from '../../../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private http = inject(HttpClient);

  private matchesCache = new Map<string, Match[]>();

  getAllMatchesByTournament(tournamentId: string): Observable<Match[]> {
    if (this.matchesCache.has(tournamentId)) {
      return of(this.matchesCache.get(tournamentId)!);
    }

    return this.http.get<Match[]>(TOURNAMENT_URLS.TOURNAMENTS + `/${tournamentId}/matches`).pipe(
      tap(matches => this.matchesCache.set(tournamentId, matches))
    );
  }
}
