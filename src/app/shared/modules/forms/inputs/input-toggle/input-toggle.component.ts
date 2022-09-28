import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormInput } from '../base/form-input';

@Component({
  selector: 'app-input-toggle',
  templateUrl: './input-toggle.component.html',
  styleUrls: ['./input-toggle.component.scss'],
  providers: [{ provide: FormInput, useExisting: InputToggle }],
})
export class InputToggle extends FormInput<boolean | null> implements OnInit {
  @Input() @HostBinding('class.inline-label') public inlineLabel: boolean =
    true;
  @Input() @HostBinding('class.tristate') public tristate: boolean = false;

  public readonly checkIcon: IconDefinition = faCheck;
  public readonly timesIcon: IconDefinition = faTimes;

  ngOnInit(): void {
    if (this._value == null && !this.tristate) {
      this._value = false;
    }
  }

  onClick(): void {
    if (!this.tristate) {
      this.value = !this._value;
    } else {
      if (this._value == null) {
        this.value = true;
      } else if (this._value === true) {
        this.value = false;
      } else if (this._value === false) {
        this.value = null;
      }
    }
  }
}
