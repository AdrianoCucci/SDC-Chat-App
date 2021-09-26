import { AfterViewInit, Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { TemplateDirective } from '../directives/template.directive';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss']
})
export class FilterList implements AfterViewInit {
  @Input() public items: any[];
  @Input() public keywordFields: string | string[];
  @Input() public options: FilterListOptions = {
    caseSensitive: false,
    exactMatch: false
  };

  private _filteredItems: any[];
  private _itemTemplate: TemplateRef<any>;

  @ContentChild(TemplateDirective) private readonly _itemTemplateDirective: TemplateDirective;

  ngAfterViewInit(): void {
    setTimeout(() => this._itemTemplate = this._itemTemplateDirective?.template);
  }

  public filter(value: string): any[] {
    const filteredItems: any[] = [];

    if(this.hasItems && this.keywordFields) {
      const keywordFields: string[] = Array.isArray(this.keywordFields) ? this.keywordFields : [this.keywordFields];

      for(let i = 0; i < this.items.length; i++) {
        const item: any = this.items[i];

        if(!this.itemHasKeyword(item, value, keywordFields, this.options)) {
          filteredItems.push(item);
        }
      }
    }

    this._filteredItems = filteredItems;
    return this._filteredItems;
  }

  public clearFilter(): void {
    this._filteredItems = null;
  }

  private itemHasKeyword(item: any, value: string, keywordFields: string[], options?: FilterListOptions): boolean {
    let hasKeyword: boolean = false;

    const isMatch = (a: string, b: string): boolean => {
      if(options == null || !options.caseSensitive) {
        a = a.toLowerCase();
        b = b.toLowerCase();
      }

      return options == null || !options.exactMatch ? a.includes(b) : a === b;
    };

    for(let i = 0; i < keywordFields.length; i++) {
      let fieldValue: string = item[keywordFields[i]];

      if(fieldValue != null && isMatch(fieldValue.toString(), value)) {
        hasKeyword = true;
        break;
      }
    }

    return hasKeyword;
  }

  public isItemFiltered(item: any): boolean {
    return this._filteredItems?.includes(item);
  }

  public get hasItems(): boolean {
    return this.items?.length > 0 ?? false;
  }

  public get filteredItems(): any[] {
    return this._filteredItems;
  }

  public get hasFilteredItems(): boolean {
    return this._filteredItems?.length > 0 ?? false;
  }

  public get itemTemplate(): TemplateRef<any> {
    return this._itemTemplate;
  }
}

export interface FilterListOptions {
  caseSensitive?: boolean;
  exactMatch?: boolean;
}