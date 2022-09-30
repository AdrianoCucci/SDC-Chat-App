import { InputValidationResult } from '../inputs/base/input-validation-result';
import { Form } from './form.component';

export interface FormSubmitResult {
  form: Form;
  inputValidations: InputValidationResult[];
  isValid: boolean;
}
