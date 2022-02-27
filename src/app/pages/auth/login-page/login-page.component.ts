import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRequest } from 'src/app/core/models/auth/auth-request';
import { AuthResponse } from 'src/app/core/models/auth/auth-response';
import { AuthService } from 'src/app/core/services/api/auth-service';
import { LoginService } from 'src/app/core/services/login.service';
import { MAIN_PATHS } from 'src/app/shared/app-paths';
import { FormSubmitResult } from 'src/app/shared/modules/forms/form/form-submit-result';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPage implements OnInit {
  public username: string;
  public password: string;
  public rememberLogin: boolean;

  public errorVisible: boolean = false;;

  private _isLoggingIn: boolean = false;
  private _loginError: string;

  constructor(private _authService: AuthService, private _loginService: LoginService, private _router: Router) { }

  ngOnInit(): void {
    if(this._loginService.loadSavedLogin()) {
      this.navigateToMain();
    }
  }

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
      this.onLoginSuccess(response.body);
    }
    catch(error) {
      this.onLoginFail(error);
    }
    finally {
      this._isLoggingIn = false;
    }
  }

  private onLoginSuccess(response: AuthResponse): void {
    this._loginService.setCurrentUser(response, this.rememberLogin);
    this.navigateToMain();
  }

  private navigateToMain(): void {
    this._router.navigateByUrl(MAIN_PATHS.root);
  }

  private onLoginFail(error: any): void {
    if(error instanceof HttpErrorResponse) {
      this._loginError = error.error.message ?? error.message;
    }
    else if(error instanceof DOMException) {
      this._loginError = error.message;
    }
    else if(typeof error === "string") {
      this._loginError = error;
    }
    else {
      this._loginError = "An unknown error occurred";
    }

    if(!environment.production) {
      console.error(error);
    }

    this.errorVisible = true;
  }

  public get isLoggingIn(): boolean {
    return this._isLoggingIn;
  }

  public get loginError(): string {
    return this._loginError;
  }
}