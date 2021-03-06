import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { SignupRequestPayload } from '../signup/signup-request.payload';
import { Observable, throwError } from 'rxjs';
import { LoginRequestPayload } from '../login/login.request.payload';
import { LoginResponse } from '../login/login-response.payload';
import { LocalStorageService } from 'ngx-webstorage';
import { map, tap } from 'rxjs/operators';
import jwtDecode, { JwtPayload } from "jwt-decode";
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl;

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();
  @Output() role: EventEmitter<string> = new EventEmitter();
  userRole: string;

  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()
  }


  constructor(private httpClient: HttpClient,
    private localStorage: LocalStorageService) {

      if (this.localStorage.retrieve('authenticationToken') != null) {
        this.userRole = this.getRoleFromJwt(this.localStorage.retrieve('authenticationToken'));
        this.role.emit(this.userRole);
      }
      

     }

  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }

  logout() {
    this.refreshTokenPayload.username = this.getUserName();
    this.refreshTokenPayload.refreshToken = this.getRefreshToken();
    this.httpClient.post(this.baseUrl + 'api/auth/logout', this.refreshTokenPayload,
      { responseType: 'text' })
      .subscribe(data => {
        console.log(data);
      }, error => {
        throwError(error);
      })
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('username');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');

    this.loggedIn.emit(false);
  }

  signup(signupRequestPayload: SignupRequestPayload): Observable<any>{
    return this.httpClient.post(this.baseUrl + 'api/auth/signup', signupRequestPayload, { responseType: 'text'});
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.httpClient.post<LoginResponse>(this.baseUrl + 'api/auth/login',
      loginRequestPayload).pipe(map(data => {
        this.localStorage.store('authenticationToken', data.authenticationToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('expiresAt', data.expiresAt);

        this.userRole = this.getRoleFromJwt(data.authenticationToken);
        
        
        this.loggedIn.emit(true);
        this.username.emit(data.username);
        this.role.emit(this.userRole);
        return true;
      }));
  }

  getRoleFromJwt(token: string): string {
  const decoded = jwtDecode<JwtPayload>(token);
  let authorities: Array<Object> = decoded['authorities'];
  return authorities[0]['authority'];
  }


  getUserName() {
  return this.localStorage.retrieve('username');
  }

  getJwtToken() {
    return this.localStorage.retrieve('authenticationToken');
  }

  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }

  getRole() {
    return this.userRole;
  }

  refreshToken() {
    this.refreshTokenPayload.username = this.getUserName();
    this.refreshTokenPayload.refreshToken = this.getRefreshToken();
    
    return this.httpClient.post<LoginResponse>(this.baseUrl + 'api/auth/refreshToken',
      this.refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('expiresAt');

        this.localStorage.store('authenticationToken',
          response.authenticationToken);
        this.localStorage.store('expiresAt', response.expiresAt);
      }));
  }

}
