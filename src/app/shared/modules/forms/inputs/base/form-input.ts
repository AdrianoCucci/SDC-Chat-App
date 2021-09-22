import { AfterViewInit, EventEmitter, HostBinding, Output } from "@angular/core";
import { Component, Input } from "@angular/core";
import { FormInputValidations } from "./form-input-validations";
import { InputValidationResult } from "./input-validation-result";

@Component({ template: '' })
export abstract class FormInput<T = any> implements AfterViewInit {
  @Output() public readonly valueChange = new EventEmitter<T>();

  @Input() public name: string = "";
  @Input() public label: string = "";
  @Input() @HostBinding("class.disabled") public disabled: boolean = false;
  @Input() @HostBinding("class.readonly") public readonly: boolean = false;
  @Input() public showErrors: boolean = true;
  @Input() public validations: FormInputValidations = null;

  protected _value: T;
  protected _isDirty: boolean = false;
  protected _errors: string[] = [];
  protected _initialized: boolean = false;

  ngAfterViewInit(): void {
    this._initialized = true;
  }

  public validate(): InputValidationResult {
    this.clearErrors();

    if(this.validations != null) {
      const namePrefix: string = this.label ? this.label : "This field";

      const matchInput: FormInput = this.validations.matchInput;
      if(matchInput != null) {
        const otherName: string = matchInput.label ?? matchInput.name;
        const otherValue: any = matchInput.value;

        if(this._value !== otherValue) {
          this._errors.push(`${namePrefix} does not match ${otherName}`);
        }
      }
      else {
        if(this.validations.required && !this.hasValue) {
          this._errors.push(`${namePrefix} is required`);
        }

        this.onValidate(this._value, this.validations, this._errors, namePrefix);
      }
    }

    return {
      input: this,
      value: this._value,
      errors: this._errors,
      isValid: this._errors == null || this._errors.length === 0
    };
  }

  public validateIfDirty(): string[] {
    if(this._isDirty) {
      this.validate();
    }

    return this._errors;
  }

  protected onValidate(value: T, validations: FormInputValidations, errors: string[], inputName: string): void { }

  public clearValue(): void {
    this.value = null;
  }

  public clearErrors(): void {
    this._errors = [];
    this._isDirty = false;
  }

  public clear(): void {
    this.clearValue();
    this.clearErrors();
  }

  protected onValueSetting(newValue: T): T { return newValue; }

  public get value(): T {
    return this._value;
  }
  @Input() public set value(newValue: T) {
    if(this._value !== newValue) {
      this._value = this.onValueSetting(newValue);

      if(this._initialized) {
        this._isDirty = true;
        this.valueChange.emit(this._value);
      }
    }
  }

  @HostBinding("class.has-value") public get hasValue(): boolean {
    return this._value?.toString().length > 0 ?? false;
  }

  @HostBinding("class.is-dirty") public get isDirty(): boolean {
    return this._isDirty;
  }

  public get errors(): string[] {
    return this._errors;
  }

  @HostBinding("class.has-errors") public get hasErrors(): boolean {
    return this._errors?.length > 0;
  }

  @HostBinding("class.required") public get required(): boolean {
    return this.validations?.required;
  }
}