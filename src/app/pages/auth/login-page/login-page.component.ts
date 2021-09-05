import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRequest } from 'src/app/core/models/auth/auth-request';
import { AuthResponse } from 'src/app/core/models/auth/auth-response';
import { AuthService } from 'src/app/core/services/api/auth-service';
import { LoginService } from 'src/app/core/services/login.service';
import { MAIN_PATHS } from 'src/app/shared/app-paths';
import { FormSubmitResult } from 'src/app/shared/components/forms/form/form-submit-result';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  public username: string;
  public password: string;

  private _isLoggingIn: boolean = false;

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
      throw error;
    }
    finally {
      this._isLoggingIn = false;
    }
  }

  private async onLoginSuccess(response: AuthResponse): Promise<void> {
    this._loginService.setCurrentUser(response);
    await this._router.navigateByUrl(MAIN_PATHS.root);
  }

  public get isLoggingIn(): boolean {
    return this._isLoggingIn;
  }
}