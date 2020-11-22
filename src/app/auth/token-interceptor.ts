import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from './shared/auth.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { error } from 'console';
import { LoginResponse } from './login/login-response.payload';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

    isTokenRefreshing = false;
    refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(public authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {

            if (req.url.indexOf('refreshToken') !== -1 
            || req.url.indexOf('login') !== -1
            || req.url.indexOf('reset') !== -1
            || req.url.indexOf('remind') !== -1
            || (req.url.indexOf('events') !== -1 && req.method !== 'GET') 
            || (req.url.indexOf('comments') !== -1 && req.method !== 'GET')) {
                return next.handle(req);
            }
            
            const jwtToken = this.authService.getJwtToken();
            if (jwtToken) {
                this.addToken(req, jwtToken);
            }
            return next.handle(req).pipe(catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 403) {
                    return this.handleAuthErrors(req, next);
                } else {
                    return throwError(error);
                }
            }));
        }

    handleAuthErrors(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap((refreshTokenResponse: LoginResponse) => {
                    this.isTokenRefreshing = false;
                    this.refreshTokenSubject.next(refreshTokenResponse.authenticationToken);

                    return next.handle(this.addToken(req, refreshTokenResponse.authenticationToken));
                })
            )

        }
    }
    
    addToken(req: HttpRequest<any>, jwtToken: any) {
        return req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + jwtToken)
        });
    }

}