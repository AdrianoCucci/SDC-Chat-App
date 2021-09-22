import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRequest } from 'src/app/core/models/auth/auth-request';
import { AuthResponse } from 'src/app/core/models/auth/auth-response';
import { AuthService } from 'src/app/core/services/api/auth-service';
import { LoginService } from 'src/app/core/services/login.service';
import { MAIN_PATHS } from 'src/app/shared/app-paths';
import { FormSubmitResult } from 'src/app/shared/modules/forms/form/form-submit-result';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPage {
  public username: string;
  public password: string;

  public errorVisible: boolean = false;;

  private _isLoggingIn: boolean = false;
  private _loginError: string;

  constructor(private _authService: AuthService, private _loginService: LoginService, private _router: Router) { }

  async onFormSubmit(result: FormSubmitResult): Promise<void> {
    if(result.isValid) {
      const request: AuthRequest = {
        username: this.username,
        password: this.password
      };

      await this.submitRequest(request);
    }
  }

  private async submitRequest(request: AuthRequest): Promise<void> {
    try {
      this._isLoggingIn = true;
      const response: HttpResponse<AuthResponse> = await this._authService.login(request).toPromise();
      await this.onLoginSuccess(response.body);
    }
    catch(error) {
      this.onLoginFail(error as HttpErrorResponse);
    }
    finally {
      this._isLoggingIn = false;
    }
  }

  private async onLoginSuccess(response: AuthResponse): Promise<void> {
    this._loginService.setCurrentUser(response);
    await this._router.navigateByUrl(MAIN_PATHS.root);
  }

  private onLoginFail(httpError: HttpErrorResponse): void {
    this._loginError = httpError.error.message ?? httpError.message;
    this.errorVisible = true;
  }

  public get isLoggingIn(): boolean {
    return this._isLoggingIn;
  }

  public get loginError(): string {
    return this._loginError;
  }
}