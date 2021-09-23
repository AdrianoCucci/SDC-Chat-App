import { AfterViewInit, Component, ContentChildren, HostBinding, Input, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { TemplateDirective } from '../../../directives/template.directive';
import { Popover } from '../../../overlays/popover/popover.component';
import { FormInput } from '../base/form-input';

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss'],
  providers: [{ provide: FormInput, useExisting: InputSelect }]
})
export class InputSelect extends FormInput implements AfterViewInit {
  @Input() public options: any[];
  @Input() public displayKey: string;
  @Input() public valueKey: string;
  @Input() public placeholder: string;
  @Input() @HostBinding("class.clearable") public clearable: boolean = false;
  @Input() @HostBinding("class.multiple") public multiple: boolean = false;
  @Input() public popoverParent: HTMLElement | "body";

  public readonly dropDownIcon: IconDefinition = faAngleDown;

  @ViewChild(Popover) private readonly _popover: Popover;
  @ContentChildren(TemplateDirective) private readonly _templates: QueryList<TemplateDirective>;

  private _selected: any;
  private _displayValue: any;
  private _valueTemplate: TemplateRef<any>;
  private _optionTemplate: TemplateRef<any>;

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    setTimeout(() => {
      this._templates.forEach((directive: TemplateDirective) => {
        if(directive.name === "value") {
          this._valueTemplate = directive.template;
        }
        else if(directive.name === "option") {
          this._optionTemplate = directive.template;
        }
      });
    });
  }

  public getOptionTemplateContext(option: any): any {
    return {
      $implicit: option,
      options: this.options,
      isSelected: this.isOptionSelected(option),
      selectCallback: () => this.onOptionSelect(option)
    }
  }

  public getOptionDisplay(item: any): any {
    let display: any = null;

    if(this.displayKey) {
      display = item != null ? item[this.displayKey] : null;
    }
    else {
      display = item;
    }

    return display;
  }

  public getOptionValue(item: any): any {
    let value: any = null;

    if(this.valueKey) {
      value = item != null ? item[this.valueKey] : null;
    }
    else {
      value = item;
    }

    return value;
  }

  public getOptionByValue(value: any): any {
    let option: any = null;

    if(this.hasOptions) {
      option = this.options.find((o: any) => this.getOptionValue(o) === value);
    }

    return option;
  }

  public getOptionByDisplay(display: any): any {
    let option: any = null;

    if(this.hasOptions) {
      option = this.options.find((o: any) => this.getOptionDisplay(o) === display);
    }

    return option;
  }

  public isOptionSelected(option: any): boolean {
    let selected: boolean = false;
    const optionValue: any = this.getOptionValue(option);

    if(!this.multiple) {
      selected = this._value === optionValue;
    }
    else if(Array.isArray(this._value)) {
      selected = this._value.includes(optionValue);
    }

    return selected;
  }

  onOptionSelect(option: any): void {
    const optionValue: any = this.getOptionValue(option);

    if(!this.multiple) {
      this._popover.hide();

      // this._selected = option;
      this.value = optionValue;
    }
    else {
      // this._selected = this.updateMultiValues(this._selected, option);
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

    this._selected = this.updateSelected(newValue);
    this._displayValue = this.updateDisplayValue(this._selected);

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

  private updateSelected(value: any): any {
    let selected: any;

    if(!this.multiple) {
      selected = this.getOptionByValue(value);
    }
    else if(Array.isArray(value)) {
      const totalSelections: any[] = [];

      for(let i = 0; i < value.length; i++) {
        const option: any = this.getOptionByValue(value[i]);
        totalSelections.push(option);
      }

      selected = totalSelections.length > 0 ? totalSelections : null;
    }

    return selected;
  }

  private updateDisplayValue(selected: any): void {
    let displayValue: any;

    if(!this.multiple) {
      displayValue = selected != null ? this.getOptionDisplay(selected) : null;
    }
    else if(Array.isArray(selected)) {
      const displays: any[] = [];

      for(let i = 0; i < selected.length; i++) {
        const display: any = this.getOptionDisplay(selected[i]);
        displays.push(display);
      }

      displayValue = displays.length > 0 ? displays : null;
    }

    return displayValue;
  }

  public get hasOptions(): boolean {
    return this.options?.length > 0 ?? false;
  }

  public get selected(): any {
    return this._selected;
  }

  public get hasSelected(): boolean {
    return this._selected != null && Array.isArray(this._selected) ? this._selected.length > 0 : true;
  }

  public get displayValue(): any {
    return this._displayValue;
  }

  public get valueTemplate(): TemplateRef<any> {
    return this._valueTemplate;
  }

  public get optionTemplate(): TemplateRef<any> {
    return this._optionTemplate;
  }
}