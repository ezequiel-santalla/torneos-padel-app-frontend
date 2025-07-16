import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Standing } from '../interfaces/standing.interface';
import { TOURNAMENT_URLS } from '../../../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class StandingService {

  private http = inject(HttpClient);

  getStandingsByTournament(tournamentId: string): Observable<Standing[]> {
    return this.http.get<Standing[]>(TOURNAMENT_URLS.TOURNAMENTS + `/${tournamentId}/standings`);
  }
}
