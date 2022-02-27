import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "src/app/core/models/users/user";
import { UserRequest } from "src/app/core/models/users/user-request";
import { UsersService } from "src/app/core/services/api/users-service";
import { LoginService } from "src/app/core/services/login.service";
import { AccessibilityOptionsModel } from "./accessibility-options.model";

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private _model: AccessibilityOptionsModel;

  constructor(private _usersService: UsersService, private _loginService: LoginService) {
    this.loadDefaultPreferences();
  }

  public async savePreferences(): Promise<void> {
    let result: Promise<void>;

    if(this._loginService.isLoggedIn) {
      try {
        const userId: number = this._loginService.user.id;

        const request: UserRequest = {
          preferencesJson: JSON.stringify({
            accessibility: this._model
          })
        };

        const response: HttpResponse<User> = await this._usersService.updateUser(userId, request).toPromise();
        this._loginService.updateCurrentUser(response.body);

        result = Promise.resolve();
      }
      catch(error) {
        result = Promise.reject(error);
      }
    }

    return result;
  }

  public loadPreferences(): void {
    const preferencesJson: string = this._loginService.user?.preferencesJson;
    const data: any = preferencesJson ? JSON.parse(preferencesJson) : null;

    if(data?.accessibility) {
      this._model = data.accessibility;
      this.updateDOM();
    }
    else {
      this.loadDefaultPreferences();
    }
  }

  public loadDefaultPreferences(): void {
    this._model = { theme: "default" };
    this.updateDOM();
  }

  public updateDOM(): void {
    const root: HTMLHtmlElement = document.querySelector("html");

    root.style.fontSize = this._model.fontSize != null ? `${this._model.fontSize}px` : null;
    this._model.theme ? root.setAttribute("theme", this._model.theme) : root.removeAttribute("theme");
  }

  public get fontSize(): number {
    return this._model.fontSize;
  }
  public set fontSize(value: number) {
    this._model.fontSize = value;
    this.updateDOM();
  }

  public get theme(): string {
    return this._model.theme;
  }
  public set theme(value: string) {
    this._model.theme = value;
    this.updateDOM();
  }
}