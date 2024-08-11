import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { CustomAuthResponse } from '@interfaces/custom-auth-response';
import { CustomAuthToken } from '@interfaces/custom-auth-token';
import { User } from '@interfaces/user';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /** Storage version to use to force reloading authentication data in storage. */
  private static readonly STORAGE_VERSION = 1;

  /** Storage key for storage version. */
  private static readonly STORAGE_VERSION_KEY = 'version';

  /** Storage key for authentication token. */
  private static readonly STORAGE_TOKEN_KEY = 'token';

  /** Where to redirect after sign in. */
  static readonly SIGN_IN_REDIRECT = '/';

  /** Where to redirect after sign out. */
  static readonly SIGN_OUT_REDIRECT = '/user';

  /** Authentication user subject. */
  static userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(AuthService.getUser());

  /** @returns Stored token from storage. */
  static get token(): string | null {
    return localStorage.getItem(AuthService.STORAGE_TOKEN_KEY);
  }

  /** Save/update token to storage. */
  static set token(token: string) {
    const jwt: CustomAuthToken | null = AuthService.parseJwt(token);
    if (jwt) {
      localStorage.setItem(AuthService.STORAGE_TOKEN_KEY, token);
    }
  }

  /**
   * Parse JWT from token.
   *
   * @param token JWT.
   *
   * @return Parsed JWT token.
   */
  private static parseJwt(token: string): CustomAuthToken | null {
    const base64Url: string = token.split('.')[1];
    if (typeof base64Url === 'undefined') {
      return null;
    }
    const base64: string = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }

  /** @returns User data from localStorage. */
  private static getUser(): User | null {
    const data: string | null = localStorage.getItem('user');
    if (data) {
      return JSON.parse(data) as User;
    }
    return null;
  }

  /** Set or update user data and update subscribers. */
  static setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    AuthService.userSubject.next(user);
  }

  /** @return Is user authenticated. */
  static isAuth(): boolean {
    return Boolean(localStorage.getItem(AuthService.STORAGE_TOKEN_KEY));
  }

  constructor(private readonly http: HttpClient,
              private readonly router: Router) {

    /**
     * Is user authenticated?
     * And is user authentication data old?
     * Sign out.
     */
    if (AuthService.isAuth() &&
      AuthService.STORAGE_VERSION !== Number(localStorage.getItem(AuthService.STORAGE_VERSION_KEY))) {
      this.signOut();
      return;
    }
  }

  /**
   * Sign user in.
   *
   * @param payload Username and password.
   * @return String observable which can be subscribed to.
   */
  signIn(payload: { email: string; password: string; }): Observable<CustomAuthResponse> {
    return this.http.post<CustomAuthResponse>(`${environment.base}auth/`, payload).pipe(
      map((data: CustomAuthResponse): CustomAuthResponse => {

        /** Store the token. */
        AuthService.token = data.access;

        /** Store the user. */
        const jwt: CustomAuthToken | null = AuthService.parseJwt(data.access);
        if (jwt) {
          AuthService.setUser(jwt.user);
        }

        /** Store storage version. */
        localStorage.setItem(AuthService.STORAGE_VERSION_KEY, String(AuthService.STORAGE_VERSION));

        /** Navigate to sign in redirect. */
        this.router.navigateByUrl(AuthService.SIGN_IN_REDIRECT).then();
        return data;
      }),
    );
  }

  /** Sign user up. */
  signUp(payload: { email: string; password: string }): Observable<void> {
    return this.http.post(`${environment.api}user/`, payload).pipe(map((): void => {
      this.signIn(payload).subscribe();
    }));
  }

  /** Un-authenticate and redirect. */
  signOut(): void {
    AuthService.userSubject.next(null);
    localStorage.clear();

    /** Navigate to sign out redirect. */
    this.router.navigateByUrl(AuthService.SIGN_OUT_REDIRECT).then();
  }
}
