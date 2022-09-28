import { FormInput } from './form-input';

export interface InputValidationResult {
  input: FormInput;
  isValid: boolean;
  value: any;
  errors: string[];
}
