import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthSession, LoginRequest, LoginResponse, UserSession } from '../models/auth.models';

const SESSION_KEY = '_Sénégal Excursions_PORTAIL_SESSION_';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private _session = signal<AuthSession | null>(this.loadSession());

    readonly session  = this._session.asReadonly();
    readonly isLogged = () => !!this._session();
    readonly user     = (): UserSession | null => this._session()?.user ?? null;

    constructor(private http: HttpClient, private router: Router) {}

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
            tap(res => this.saveSession(res))
        );
    }

    refreshToken(): Observable<LoginResponse> {
        const refresh = this._session()?.refreshToken;
        return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken: refresh }).pipe(
            tap(res => this.saveSession(res))
        );
    }

    logout(): void {
        localStorage.removeItem(SESSION_KEY);
        this._session.set(null);
        this.router.navigate(['/connexion']);
    }

    get accessToken(): string | null {
        return this._session()?.accessToken ?? null;
    }

    get isTokenExpired(): boolean {
        const s = this._session();
        if (!s) return true;
        return Date.now() >= s.expiresAt;
    }

    private saveSession(res: LoginResponse): void {
        const session: AuthSession = {
            accessToken:  res.accessToken,
            refreshToken: res.refreshToken,
            expiresIn:    res.expiresIn,
            expiresAt:    Date.now() + (res.expiresIn * 1000),
            user:         res.user,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        this._session.set(session);
    }

    private loadSession(): AuthSession | null {
        try {
            const raw = localStorage.getItem(SESSION_KEY);
            if (!raw) return null;
            const s: AuthSession = JSON.parse(raw);
            if (Date.now() >= s.expiresAt) { localStorage.removeItem(SESSION_KEY); return null; }
            return s;
        } catch { return null; }
    }
}
