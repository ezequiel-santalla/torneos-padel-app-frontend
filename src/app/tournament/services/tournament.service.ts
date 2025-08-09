import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Tournament, TournamentsResponse } from '../interfaces/tournament.interface';
import { Observable, of, tap } from 'rxjs';
import { TOURNAMENT_URLS } from '../../constants/api.constants';
import { PaginationOptions } from '../../shared/interfaces/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  private http = inject(HttpClient);

  private tournamentsCache = new Map<string, TournamentsResponse>();
  private tournamentCache = new Map<string, Tournament>();

  getAll(options: PaginationOptions): Observable<TournamentsResponse> {
    const { size = 8, page = 0 } = options;

    const key = `tournaments-${page}-${size}`;

    if (this.tournamentsCache.has(key)) {
      return of(this.tournamentsCache.get(key)!);
    }

    return this.http.get<TournamentsResponse>(`${TOURNAMENT_URLS.TOURNAMENTS}`, {
      params: {
        size: size,
        page: page
      }
    }).pipe(
      tap(resp => this.tournamentsCache.set(key, resp))
    );
  }

  getById(id: string): Observable<Tournament> {
    if (this.tournamentCache.has(id)) {
      return of(this.tournamentCache.get(id)!);
    }

    return this.http.get<Tournament>(`${TOURNAMENT_URLS.TOURNAMENTS}/${id}`).pipe(
      tap(tournament => this.tournamentCache.set(id, tournament))
    );
  }

  create(tournament: Tournament): Observable<Tournament> {
    return this.http.post<Tournament>(TOURNAMENT_URLS.TOURNAMENTS, tournament);
  }

  update(id: string, tournament: Tournament): Observable<Tournament> {
    return this.http.put<Tournament>(`${TOURNAMENT_URLS.TOURNAMENTS}/${id}`, tournament);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${TOURNAMENT_URLS.TOURNAMENTS}/${id}`);
  }
}
