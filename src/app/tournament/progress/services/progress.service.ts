import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Progress } from '../interfaces/progress.interface';
import { TOURNAMENT_URLS } from '../../../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  private http = inject(HttpClient);

  private progressCache = new Map<string, Progress>();

  getProgressByTournament(tournamentId: string): Observable<Progress> {
    if (this.progressCache.has(tournamentId)) {
      return of(this.progressCache.get(tournamentId)!);
    }

    return this.http.get<Progress>(`${TOURNAMENT_URLS.TOURNAMENTS}/${tournamentId}/progress`).pipe(
      tap(progress => this.progressCache.set(tournamentId, progress))
    );
  }
}
