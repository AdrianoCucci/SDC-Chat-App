import { FormInputValidations } from '../base/form-input-validations';

export interface InputTextValidations extends FormInputValidations {
  pattern?: RegExp | string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
}
