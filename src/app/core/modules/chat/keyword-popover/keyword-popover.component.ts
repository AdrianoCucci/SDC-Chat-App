import {
  AfterViewInit,
  Component,
  ElementRef,
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
export class KeywordPopoverComponent implements AfterViewInit {
  @Output() public readonly onKeywordSelect = new EventEmitter<string>();
  @Output() public readonly onShow = new EventEmitter<void>();
  @Output() public readonly onHide = new EventEmitter<void>();

  @Input() public keywords?: Keywords;
  @Input() public header?: string;

  @ViewChild(Popover) private readonly _popover: Popover;
  @ViewChild('list') private readonly _listRef: ElementRef;

  private _keywordFilter?: string;
  private _filteredKeywords?: string[];
  private _list: HTMLElement;
  private _focusedListItem?: HTMLElement;

  ngAfterViewInit(): void {
    this._list = this._listRef.nativeElement;
  }

  public show(event: MouseEvent | HTMLElement, parent?: PopoverParent): void {
    this._popover.show(event, parent);
  }

  public hide(): void {
    this._popover.hide();
  }

  public toggleVisible(event: any, parent?: PopoverParent): void {
    this._popover.toggleVisible(event, parent);
  }

  public focus(): void {
    this._list.focus();
  }

  public getFilteredKeywords(filter: string): string[] {
    if (!filter) {
      return [];
    }

    const lowerFilter: string = filter.toLowerCase();
    return (
      this.keywords?.values?.filter((v: string) =>
        v.toLowerCase().includes(lowerFilter)
      ) ?? []
    );
  }

  onListItemFocus(item: HTMLElement): void {
    this.setFocusedListItem(item);
  }

  onListArrowKeyDown(): void {
    const nextItem = (this._focusedListItem?.nextElementSibling ??
      this._list.firstElementChild) as HTMLElement;

    this.setFocusedListItem(nextItem);
  }

  onListArrowKeyUp(): void {
    const prevItem = (this._focusedListItem?.previousElementSibling ??
      this._list.lastElementChild) as HTMLElement;

    this.setFocusedListItem(prevItem);
  }

  private setFocusedListItem(item: HTMLElement): void {
    if (item) {
      item.focus();
      this._focusedListItem = item;
    }
  }

  public get visible(): boolean {
    return this._popover.visible;
  }

  public get keywordFilter(): string {
    return this._keywordFilter ?? '';
  }

  @Input() public set keywordFilter(value: string) {
    this._keywordFilter = value;
    this._filteredKeywords = value
      ? this.getFilteredKeywords(value)
      : undefined;

    this._popover.realign();
  }

  public get filteredKeywords(): string[] {
    return this._filteredKeywords ?? this.keywords?.values;
  }

  public get hasKeywordSuggestions(): boolean {
    return this.filteredKeywords?.length > 0 ?? false;
  }
}
