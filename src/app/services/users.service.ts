import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
PostLoginUrl = `${environment.baseURL}/api/User/Login`;
PostRegisterUrl = `${environment.baseURL}/api/User/AddUser`;
PutUpdateUserUrl = `${environment.baseURL}/api/User/UpdateUser`;

  constructor(private httpClient : HttpClient, private tokenService: TokenService) { }

  postRegisterUser(username: string, email: string, password: string) {
    return this.httpClient.post(this.PostRegisterUrl, { username, email, password });
  }

  postLoginUser(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.PostLoginUrl, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  PutUpdateUser(username: string, email: string, password: string) {
    return this.httpClient.put(this.PutUpdateUserUrl, { username, email, password });
  }

  isLoggedIn() : boolean {
    return this.tokenService.getToken() !== null;
  }
  
  
  isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

  logout() {
    localStorage.removeItem('token');
  }
}
