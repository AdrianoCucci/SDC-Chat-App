import { FormInputValidations } from "../base/form-input-validations";

export interface TextAreaValidations extends FormInputValidations {
  minLength?: number;
  maxLength?: number;
}