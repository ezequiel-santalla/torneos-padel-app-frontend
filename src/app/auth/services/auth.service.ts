import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_URLS } from '../../constants/api.constants';
import { User } from '../interfaces/user.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

@Injectable({providedIn: 'root'})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _playerId = signal<string | null>(null);
  private _name = signal<string | null>(null);
  private _lastName = signal<string | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    stream: () => this.checkAuthStatus(),
  })

  authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'Verificando...';

    if (this._authStatus() === 'authenticated') return 'Autenticado';

    return 'No autenticado';
  });

  playerId = computed<string | null>(() => this._playerId());
  name = computed<string | null>(() => this._name());
  lastName = computed<string | null>(() => this._lastName());
  token = computed<string | null>(() => this._token());

  login(credentials: { email: string, password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${AUTH_URLS.LOGIN}`, credentials)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  register(userData: any): Observable<User> {
    return this.http.post<User>(AUTH_URLS.REGISTER, userData);
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();

      return of(false);
    }

    return this.http.get<AuthResponse>(`${AUTH_URLS.CHECK_STATUS}`, {
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  logout() {
    this._playerId.set(null);
    this._name.set(null);
    this._lastName.set(null);
    this._token.set(null);
    this._authStatus.set('unauthenticated');

    localStorage.removeItem('token');
  }

  private handleAuthSuccess(resp: AuthResponse): boolean {
    this._playerId.set(resp.playerId);
    this._name.set(resp.name);
    this._lastName.set(resp.lastName);
    this._authStatus.set('authenticated');
    this._token.set(resp.token);

    localStorage.setItem('token', resp.token);

    return true;
  }

  private handleAuthError(error: any): Observable<boolean> {
    this.logout();

    return of(false);
  }
}
