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

  private _itemTemplate: TemplateRef<any>;

  @ContentChild(TemplateDirective) private readonly _itemTemplateDirective: TemplateDirective;

  ngAfterViewInit(): void {
    setTimeout(() => this._itemTemplate = this._itemTemplateDirective?.template);
  }

  public get itemTemplate(): TemplateRef<any> {
    return this._itemTemplate;
  }
}