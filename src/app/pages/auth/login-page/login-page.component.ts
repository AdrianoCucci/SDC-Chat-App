import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { defer, NEVER, Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthRequest } from 'src/app/core/models/auth/auth-request';
import { AuthResponse } from 'src/app/core/models/auth/auth-response';
import { AuthService } from 'src/app/core/services/api/auth-service';
import { LoginService } from 'src/app/core/services/login.service';
import { MAIN_PATHS } from 'src/app/shared/app-paths';
import { parseErrorMessage } from 'src/app/shared/functions/parse-http-error';
import { FormSubmitResult } from 'src/app/shared/modules/forms/form/form-submit-result';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPage implements OnInit {
  public username: string;
  public password: string;
  public rememberLogin: boolean;

  public errorVisible: boolean = false;

  private _isLoggingIn: boolean = false;
  private _loginError: string;

  constructor(
    private _authService: AuthService,
    private _loginService: LoginService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    if (this._loginService.loadSavedLogin()) {
      this.navigateToMain();
    }
  }

  onFormSubmit(result: FormSubmitResult): void {
    if (result.isValid) {
      const request: AuthRequest = {
        username: this.username,
        password: this.password,
      };

      this.login(request).subscribe();
    }
  }

  private login(request: AuthRequest): Observable<void> {
    return defer<void>(() => {
      this._isLoggingIn = true;

      return this._authService.login(request).pipe(
        tap((response: HttpResponse<AuthResponse>) =>
          this.onLoginSuccess(response.body)
        ),
        finalize(() => (this._isLoggingIn = false)),
        catchError((error: any) => this.onLoginFail(error))
      );
    });
  }

  private onLoginSuccess(response: AuthResponse): void {
    this._loginService.setCurrentUser(response, this.rememberLogin);
    this.navigateToMain();
  }

  private navigateToMain(): void {
    this._router.navigateByUrl(MAIN_PATHS.root);
  }

  private onLoginFail(error: any): Observable<never> {
    this._loginError = parseErrorMessage(error);
    this.errorVisible = true;

    return NEVER;
  }

  public get isLoggingIn(): boolean {
    return this._isLoggingIn;
  }

  public get loginError(): string {
    return this._loginError;
  }
}
