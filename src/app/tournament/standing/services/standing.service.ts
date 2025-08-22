import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Standing } from '../interfaces/standing.interface';
import { TOURNAMENT_URLS } from '../../../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class StandingService {

  private http = inject(HttpClient);

  private standingsCache = new Map<string, Standing[]>();

  getStandingsByTournament(tournamentId: string): Observable<Standing[]> {

  if (this.standingsCache.has(tournamentId)) {
    return of(this.standingsCache.get(tournamentId)!);
  }

  return this.http.get<Standing[]>(TOURNAMENT_URLS.TOURNAMENTS + `/${tournamentId}/standings`).pipe(
    tap(standings => this.standingsCache.set(tournamentId, standings))
  );
}
}
