import { InputValidationResult } from "../../../../shared/components/forms/inputs/base/input-validation-result";
import { Form } from "./form.component";

export interface FormSubmitResult {
  form: Form;
  inputValidations: InputValidationResult[];
  isValid: boolean;
}