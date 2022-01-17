import { AfterViewInit, Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faSort, faSortAmountDown, faSortAmountUp } from '@fortawesome/free-solid-svg-icons';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { PagedList } from '../../models/pagination/paged-list';
import { TemplateDirective } from '../directives/template.directive';
import { PageEvent } from './page-event';
import { TableCell } from './table-cell';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class Table implements AfterViewInit {
  @Input() public cells: TableCell[];
  @Input() public data: any[];
  @Input() public columnMode = ColumnMode.force;
  @Input() public serverPaging: boolean = false;
  @Input() public offset: number = 0;
  @Input() public limit: number = 20;
  @Input() public pageHandler: (event: PageEvent) => Promise<PagedList<any>>

  public readonly sortNoneIcon: IconDefinition = faSort;
  public readonly sortAscIcon: IconDefinition = faSortAmountUp;
  public readonly sortDescIcon: IconDefinition = faSortAmountDown;

  @ContentChildren(TemplateDirective) private readonly _templates: QueryList<TemplateDirective>;
  private readonly _rowActionsTemplateName: string = "table-row-actions";
  private readonly _activeFiltersMap = new Map<TableCell, any>();

  private _count: number;
  private _initialized: boolean;
  private _filteredData: any[];
  private _rowActionsTemplate: TemplateRef<any>;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.mapTemplates(this._templates.toArray(), this.cells);
      this._initialized = true;
    });
  }

  private mapTemplates(directives: TemplateDirective[], cells: TableCell[]): void {
    for(let i = 0; i < directives.length; i++) {
      const directive: TemplateDirective = directives[i];
      const name: string = directive.name;

      if(name) {
        if(name === this._rowActionsTemplateName) {
          this._rowActionsTemplate = directive.template;
        }
        else {
          const cell: TableCell = cells?.find((cell: TableCell) => cell.prop === name);

          if(cell != null) {
            cell.cellTemplate = directive.template;
          }
        }
      }
    }
  }

  public refresh(): void {
    if(this.data != null) {
      this.data = [...this.data];

      if(this._filteredData != null) {
        this._filteredData = [...this._filteredData];
        this._filteredData = this.applyActiveFilters(this.data);
      }

    }
  }

  public getRow(index: number): any {
    let item: any = null;

    if(this.hasData && index > -1 && index < this.data.length) {
      item = this.data[index];
    }

    return item;
  }

  public findRow(predicate: (item: any) => boolean): any {
    let item: any = null;

    if(this.hasData && predicate != null) {
      item = this.data.find(predicate);
    }

    return item;
  }

  public findAllRows(predicate: (item: any) => boolean): any {
    let item: any = null;

    if(this.hasData && predicate != null) {
      item = this.data.filter(predicate);
    }

    return item;
  }

  public addRow(item: any): any[] {
    if(item != null) {
      if(this.hasData) {
        this.data.push(item);
      }
      else {
        this.data = [item];
      }

      this.refresh();
    }

    return this.data;
  }

  public addManyRows(...items: any[]): any[] {
    if(items) {
      for(let i = 0; i < items.length; i++) {
        const item: any = items[i];

        if(item != null) {
          if(this.hasData) {
            this.data.push(item);
          }
          else {
            this.data = [item];
          }
        }
      }

      this.refresh();
    }

    return this.data;
  }

  public setRow(index: number, item: any): any[] {
    if(this.hasData && index > -1 && index < this.data.length) {
      this.data[index] = item;
      this.refresh();
    }

    return this.data;
  }

  public assignRow(index: number, item: any): any[] {
    if(this.hasData && index > -1 && index < this.data.length) {
      Object.assign(this.data[index], item);
      this.refresh();
    }

    return this.data;
  }

  public deleteRow(index: number): any[] {
    if(this.hasData && index > -1 && index < this.data.length) {
      this.data.splice(index, 1);
      this.refresh();
    }

    return this.data;
  }

  public querySetRow(item: any, predicate: (item: any) => boolean): any[] {
    const row: any = this.findRow(predicate);

    if(row != null) {
      const index: number = this.data.indexOf(row);
      this.data[index] = item;

      this.refresh();
    }

    return this.data;
  }

  public querySetAllRows(item: any, predicate: (item: any) => boolean): any[] {
    const rows: any[] = this.findAllRows(predicate);

    if(rows?.length > 0) {
      for(let i = 0; i < rows.length; i++) {
        const row: any = rows[i];
        const index: number = this.data.indexOf(row);
        this.data[index] = item;
      }

      this.refresh();
    }

    return this.data;
  }

  public queryAssignRow(item: any, predicate: (item: any) => boolean): any[] {
    const row: any = this.findRow(predicate);

    if(row != null) {
      const index: number = this.data.indexOf(row);
      Object.assign(this.data[index], item);

      this.refresh();
    }

    return this.data;
  }

  public queryAssignAllRows(item: any, predicate: (item: any) => boolean): any[] {
    const rows: any[] = this.findAllRows(predicate);

    if(rows?.length > 0) {
      for(let i = 0; i < rows.length; i++) {
        const row: any = rows[i];
        const index: number = this.data.indexOf(row);
        Object.assign(this.data[index], item);
      }

      this.refresh();
    }

    return this.data;
  }

  public queryDeleteRow(predicate: (item: any) => boolean): any[] {
    const row: any = this.findRow(predicate);

    if(row != null) {
      const index: number = this.data.indexOf(row);
      this.data.splice(index, 1);

      this.refresh();
    }

    return this.data;
  }

  public queryDeleteAllRows(predicate: (item: any) => boolean): any[] {
    const rows: any[] = this.findAllRows(predicate);

    if(rows?.length > 0) {
      for(let i = 0; i < rows.length; i++) {
        const row: any = rows[i];
        const index: number = this.data.indexOf(row);
        this.data.splice(index, 1);
      }

      this.refresh();
    }

    return this.data;
  }

  onFilter(cell: TableCell, filterValue: any): void {
    if(filterValue == null || (typeof filterValue === "string" && !filterValue)) {
      this._activeFiltersMap.delete(cell);
    }
    else {
      this._activeFiltersMap.set(cell, filterValue);
    }

    this._filteredData = this.applyActiveFilters(this.data);
  }

  async onPage(event: PageEvent): Promise<void> {
    if(this.pageHandler != null) {
      const response: PagedList<any> = await this.pageHandler(event);

      if(response && response.data && response.pagination) {
        this._count = response.pagination.totalItemsCount;
        this.data = response.data;
        this.offset = response.pagination.skip;
        this.limit = response.pagination.take;
      }
    }
  }

  private applyActiveFilters(data: any[]): any[] {
    let filteredData: any[] = data;

    this._activeFiltersMap.forEach((filterValue: any, cell: TableCell) => {
      filteredData = filteredData.filter((row: any) => this.filterDataRow(cell, row[cell.prop], filterValue));
    });

    return filteredData;
  }

  private filterDataRow(cell: TableCell, rowValue: any, filterValue: any): boolean {
    let result: boolean;

    switch(cell.type) {
      case "number":
      case "boolean":
      case "select":
        result = filterValue != null ? rowValue === filterValue : true;
        break;

      default:
        result = `${rowValue}`.toLowerCase().includes(`${filterValue}`.toLowerCase());
        break;
    }

    return result;
  }

  public get initialized(): boolean {
    return this._initialized;
  }

  public get hasData(): boolean {
    return this.data?.length > 0 ?? false;
  }

  public get rows(): any[] {
    return this._filteredData ?? this.data;
  }

  public get count(): number {
    return this._count ?? this.rows?.length;
  }

  public get rowActionsTemplate(): TemplateRef<any> {
    return this._rowActionsTemplate;
  }
}