import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Tournament } from '../interfaces/tournament.interface';
import { Observable } from 'rxjs';
import { TOURNAMENT_URLS } from '../../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  private http = inject(HttpClient);

  getAll(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(TOURNAMENT_URLS.TOURNAMENTS);
  }

  getById(id: string): Observable<Tournament> {
    return this.http.get<Tournament>(`${TOURNAMENT_URLS.TOURNAMENTS}/${id}`);
  }

  create(tournament: Tournament): Observable<Tournament> {
    return this.http.post<Tournament>(TOURNAMENT_URLS.TOURNAMENTS, tournament);
  }

  update(id: number, tournament: Tournament): Observable<Tournament> {
    return this.http.put<Tournament>(`${TOURNAMENT_URLS.TOURNAMENTS}/${id}`, tournament);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${TOURNAMENT_URLS.TOURNAMENTS}/${id}`);
  }
}
