import { Component, HostBinding, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Popover } from '../../../overlays/popover/popover.component';
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
  @Input() public placeholder: string;
  @Input() @HostBinding("class.clearable") public clearable: boolean = false;
  @Input() @HostBinding("class.multiple") public multiple: boolean = false;

  public readonly dropDownIcon: IconDefinition = faAngleDown;

  private _displayValue: any;

  public getItemDisplay(item: any): any {
    let display: any = null;

    if(this.displayKey) {
      display = item != null ? item[this.displayKey] : null;
    }
    else {
      display = item;
    }

    return display;
  }

  public getItemValue(item: any): any {
    let value: any = null;

    if(this.valueKey) {
      value = item != null ? item[this.valueKey] : null;
    }
    else {
      value = item;
    }

    return value;
  }

  public isOptionSelected(option: any): boolean {
    let selected: boolean = false;
    const optionValue: any = this.getItemValue(option);

    if(!this.multiple) {
      selected = this._value === optionValue;
    }
    else if(Array.isArray(this._value)) {
      selected = this._value.includes(optionValue);
    }

    return selected;
  }

  onOptionClick(option: any, popover: Popover): void {
    const optionValue: any = this.getItemValue(option);

    if(!this.multiple) {
      popover.hide();
      this.value = optionValue;
    }
    else {
      this.value = this.updateMultiValues(this._value, optionValue);
    }
  }

  private updateMultiValues(values: any[], selectedValue: any): any[] {
    if(values == null || !Array.isArray(values)) {
      values = [selectedValue];
    }
    else if(values.includes(selectedValue)) {
      values.splice(values.indexOf(selectedValue), 1);
    }
    else {
      values.push(selectedValue);
    }

    return [...values];
  }

  protected onValueSetting(newValue: any) {
    if(newValue != null) {
      if(!this.multiple) {
        newValue = this.parseSettingValue(newValue);
      }
      else if(Array.isArray(newValue)) {
        for(let i = 0; i < newValue.length; i++) {
          newValue[i] = this.parseSettingValue(newValue[i]);
        }
      }
    }
    else {
      this._displayValue = null;
    }

    setTimeout(() => this.updateDisplayValue(newValue));
    return newValue;
  }

  private parseSettingValue(value: any): any {
    if(!isNaN(value)) {
      value = Number(value);
    }
    else if(value === "true") {
      value = true;
    }
    else if(value === "false") {
      value = false;
    }

    return value;
  }

  private updateDisplayValue(value: any): void {
    if(!this.multiple) {
      const selectedValue: any = this.options.find((o: any) => this.getItemValue(o) === value);
      this._displayValue = this.getItemDisplay(selectedValue);
    }
    else if(Array.isArray(this._value)) {
      const selectedOptions: any[] = this.options
        .filter((o: any) => {
          const optionValue: any = this.getItemValue(o);
          return (<any[]>this._value).includes(optionValue);
        })
        .map((o: any) => this.getItemDisplay(o));

      this._displayValue = selectedOptions?.length > 0 ? selectedOptions : null;
    }
  }

  public get hasOptions(): boolean {
    return this.options?.length > 0 ?? false;
  }

  public get displayValue(): any {
    return this._displayValue;
  }
}