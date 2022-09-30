import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import {
  faExclamation,
  faExclamationCircle,
  faInfo,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { getCommonIconDefinition } from '../../functions/get-common-icon-definition';
import { CommonIcon } from '../../models/common-icon.type';

@Component({
  selector: 'app-inline-alert',
  templateUrl: './inline-alert.component.html',
  styleUrls: ['./inline-alert.component.scss'],
})
export class InlineAlert {
  @Output() public readonly visibleChange = new EventEmitter<boolean>();
  @Output() public readonly onShow = new EventEmitter<void>();
  @Output() public readonly onHide = new EventEmitter<void>();

  @Input() @HostBinding('class') public type: AlertType = 'plain';
  @Input() public header: string;
  @Input() public summary: string | string[];
  @Input() public closeable: boolean = false;

  private readonly _typeIconMap = new Map<AlertType, IconDefinition>([
    ['question', faQuestion],
    ['info', faInfo],
    ['warn', faExclamation],
    ['error', faExclamationCircle],
  ]);

  private _icon: IconDefinition;
  @HostBinding('class.visible') private _visible: boolean = false;
  private _contentVisible: boolean = false;
  private _visibleTimeout: number;

  ngOnInit() {
    this._contentVisible = this._visible;
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  public toggleVisible(): void {
    this.visible = !this.visible;
  }

  public getTypeIcon(type?: AlertType): IconDefinition {
    return this._typeIconMap.get(type ?? this.type);
  }

  public isSummaryArray(): boolean {
    return Array.isArray(this.summary);
  }

  public get icon(): IconDefinition {
    return this._icon;
  }
  @Input() public set icon(value: CommonIcon) {
    this._icon = getCommonIconDefinition(value);
  }

  public get visible(): boolean {
    return this._visible;
  }
  @Input() public set visible(value: boolean) {
    if (this._visible !== value) {
      this._visible = value;
      this.visibleChange.emit(this._visible);

      window.clearTimeout(this._visibleTimeout);

      if (this._visible) {
        this._contentVisible = true;
        this.onShow.emit();
      } else {
        this.onHide.emit();
        this._visibleTimeout = window.setTimeout(
          () => (this._contentVisible = false),
          160
        );
      }
    }
  }

  public get contentVisible(): boolean {
    return this._contentVisible;
  }
}

export type AlertType = 'plain' | 'question' | 'info' | 'warn' | 'error';
