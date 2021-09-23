import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormInput } from '../base/form-input';
import { InputTextValidations } from './input-text-validations';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [{ provide: FormInput, useExisting: InputText }]
})
export class InputText extends FormInput {
  @Input() public type: string = "text";
  @Input() public placeholder: string = "";
  @Input() public validations: InputTextValidations = null;

  @ViewChild("input") private readonly _inputRef: ElementRef;

  public clearErrors(): void {
    super.clearErrors();
    (this._inputRef.nativeElement as HTMLInputElement).classList.remove("ng-dirty", "ng-invalid");
  }

  protected onValidate(value: string, validations: InputTextValidations, errors: string[], inputName: string): void {
    if(validations.pattern && value.match(validations.pattern) == null) {
      errors.push(`${inputName} is an invalid format.`);
    }
    if(validations.minLength != null && value.trim().length < validations.minLength) {
      errors.push(`${inputName} requires at least ${validations.minLength} characters`);
    }
    if(validations.maxLength != null && value.trim().length > validations.maxLength) {
      errors.push(`${inputName} cannot exceed ${validations.maxLength} characters`);
    }
  }

  protected onValueSetting(newValue: any): any {
    if(this.type === "number" && newValue != null) {
      if(newValue === "" || Number.isNaN(newValue)) {
        newValue = null;
      }
      else {
        newValue = Number(newValue);
      }
    }

    console.log(newValue);

    return newValue;
  }

  public get pattern(): RegExp | string {
    return this.validations?.pattern;
  }

  public get min(): number {
    return this.validations?.min;
  }

  public get max(): number {
    return this.validations?.max;
  }

  public get minLength(): number {
    return this.validations?.minLength;
  }

  public get maxLength(): number {
    return this.validations?.maxLength;
  }
}
