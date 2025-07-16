import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Progress } from '../interfaces/progress.interface';
import { TOURNAMENT_URLS } from '../../../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  private http = inject(HttpClient);

  getProgressByTournament(tournamentId: string): Observable<Progress> {
    return this.http.get<Progress>(TOURNAMENT_URLS.TOURNAMENTS + `/${tournamentId}/progress`);
  }
}
