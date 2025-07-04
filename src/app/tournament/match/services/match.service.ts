import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Match } from '../interfaces/match.interface';
import { TOURNAMENT_URLS } from '../../../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private http = inject(HttpClient);

  getAllMatchesByTournament(tournamentId: string): Observable<Match[]> {
    return this.http.get<Match[]>(TOURNAMENT_URLS.TOURNAMENTS + `/${tournamentId}/matches`);
  }
}
