import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {IFbAuthResponse, IUser} from '../../../shared/interfaces';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {ObservableInput, Subject, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  errors$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}

  get token(): string {
    const expDate = new Date(localStorage.getItem('fbTokenExpires'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fbToken');
  };

  login(user: IUser) {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError)
      )
  };

  logout() {
    this.setToken(null)
  };

  isAuthenticated(): boolean {
    return !!this.token;
  };

  private handleError = (error:HttpErrorResponse): ObservableInput<any> => {
    const {message} = error.error.error;
    this.errors$.next(message);
    return throwError(message);
  };

  private setToken(response: IFbAuthResponse | null) {
    if (response) {
      const expDate = new Date( new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('fbToken', response.idToken);
      localStorage.setItem('fbTokenExpires', expDate.toString());
    } else {
      localStorage.clear()
    }
  };
}
