import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pair } from '../interfaces/pair.interface';
import { TOURNAMENT_URLS } from '../../../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class PairService {

  private http = inject(HttpClient);

  getAllPairsByTournament(tournamentId: string): Observable<Pair[]> {
    return this.http.get<Pair[]>(TOURNAMENT_URLS.TOURNAMENTS + `/${tournamentId}/pairs`);
  }
}
