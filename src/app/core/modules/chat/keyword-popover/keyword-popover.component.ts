import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Keywords } from 'src/app/core/models/chat/keywords';
import {
  Popover,
  PopoverParent,
} from 'src/app/shared/modules/overlays/popover/popover.component';

@Component({
  selector: 'app-keyword-popover',
  templateUrl: './keyword-popover.component.html',
  styleUrls: ['./keyword-popover.component.scss'],
})
export class KeywordPopoverComponent {
  @Output() public readonly onKeywordSelect = new EventEmitter<string>();

  @Input() public keywords?: Keywords;
  @Input() public header?: string;

  @ViewChild(Popover) public readonly _popover: Popover;

  public show(event: MouseEvent | HTMLElement, parent?: PopoverParent): void {
    this._popover.show(event, parent);
  }

  public hide(): void {
    this._popover.hide();
  }

  public toggleVisible(event: any, parent?: PopoverParent): void {
    this._popover.toggleVisible(event, parent);
  }

  public get visible(): boolean {
    return this._popover.visible;
  }
}
