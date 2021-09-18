import { Component, ContentChildren, EventEmitter, HostBinding, Input, Output, QueryList } from '@angular/core';
import { FormGroup } from '../form-group/form-group.component';
import { FormInput } from '../inputs/base/form-input';
import { InputValidationResult } from '../inputs/base/input-validation-result';
import { FormSubmitResult } from './form-submit-result';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class Form {
  @Output() public readonly onSubmit = new EventEmitter<FormSubmitResult>();

  @Input() @HostBinding("class.disabled") public disabled: boolean = false;

  @ContentChildren(FormInput) private readonly _childInputs: QueryList<FormInput>;
  @ContentChildren(FormGroup) private readonly _childGroups: QueryList<FormGroup>;

  public submit(): FormSubmitResult {
    const inputs: FormInput[] = this.getInputs();
    const inputValidations: InputValidationResult[] = [];

    for(let i = 0; i < inputs.length; i++) {
      inputValidations.push(inputs[i].validate());
    }

    const result: FormSubmitResult = {
      form: this,
      inputValidations,
      isValid: !inputValidations.some(v => !v.isValid)
    };

    this.onSubmit.emit(result);

    return result;
  }

  public getInputs(): FormInput[] {
    let inputs: FormInput[] = this._childInputs.toArray();
    this._childGroups.forEach((group: FormGroup) => inputs = inputs.concat(group.getInputs()));

    return inputs;
  }

  public clearInputs(): void {
    const inputs: FormInput[] = this.getInputs();

    for(let i = 0; i < inputs.length; i++) {
      inputs[i].clear();
    }
  }

  public clearInputValues(): void {
    const inputs: FormInput[] = this.getInputs();

    for(let i = 0; i < inputs.length; i++) {
      inputs[i].clearValue();
    }
  }

  public clearInputErrors(): void {
    const inputs: FormInput[] = this.getInputs();

    for(let i = 0; i < inputs.length; i++) {
      inputs[i].clearErrors();
    }
  }

  onFormSubmit(): void {
    this.submit();
  }
}