import { Component, Input } from '@angular/core';
import { FormInput } from '../base/form-input';

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss'],
  providers: [{ provide: FormInput, useExisting: InputSelect }]
})
export class InputSelect extends FormInput {
  @Input() public options: any[];
  @Input() public displayKey: string;
  @Input() public valueKey: string;
  @Input() public clearable: boolean = false;

  protected onValueSetting(newValue: any) {
    if(newValue != null) {
      if(!isNaN(newValue)) {
        newValue = Number(newValue);
      }
      else if(newValue === "true") {
        newValue = true;
      }
      else if(newValue === "false") {
        newValue = false;
      }
    }

    return newValue;
  }
}