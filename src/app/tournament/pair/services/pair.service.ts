import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Pair } from '../interfaces/pair.interface';
import { TOURNAMENT_URLS } from '../../../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class PairService {

  private http = inject(HttpClient);

  private pairsCache = new Map<string, Pair[]>();

  getAllPairsByTournament(tournamentId: string): Observable<Pair[]> {
    if (this.pairsCache.has(tournamentId)) {
      return of(this.pairsCache.get(tournamentId)!);
    }

    return this.http.get<Pair[]>(TOURNAMENT_URLS.TOURNAMENTS + `/${tournamentId}/pairs`).pipe(
      tap(pairs => this.pairsCache.set(tournamentId, pairs))
    );
  }

  deletePairInTournament(tournamentId: string, pairId: string): Observable<void> {
    return this.http.delete<void>(`${TOURNAMENT_URLS.TOURNAMENTS}/${tournamentId}/pairs/${pairId}`);
  }
}
