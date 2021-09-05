import { Component, ContentChildren, Input, OnInit, QueryList } from '@angular/core';
import { FormInput } from '../inputs/base/form-input';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss']
})
export class FormGroup {
  @Input() public header: string;

  @ContentChildren(FormInput) private readonly _childInputs: QueryList<FormInput>;
  @ContentChildren(FormGroup) private readonly _childGroups: QueryList<FormGroup>;

  public getInputs(): FormInput[] {
    let inputs: FormInput[] = this._childInputs.toArray();
    this._childGroups.forEach((group: FormGroup) => inputs = inputs.concat(group.getInputs()));

    return inputs;
  }
}
