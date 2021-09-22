import { AfterViewInit, Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faSort, faSortAmountDown, faSortAmountUp } from '@fortawesome/free-solid-svg-icons';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { TemplateDirective } from '../directives/template.directive';
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

  public readonly sortNoneIcon: IconDefinition = faSort;
  public readonly sortAscIcon: IconDefinition = faSortAmountUp;
  public readonly sortDescIcon: IconDefinition = faSortAmountDown;

  @ContentChildren(TemplateDirective) private readonly _templates: QueryList<TemplateDirective>;
  private readonly _rowActionsTemplateName: string = "table-row-actions";

  private _initialized: boolean;
  private _filteredData: any[];
  private _lastSortFunc: Function;
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

      this.data = [...this.data];
      this.repeatLastSort();
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

      this.data = [...this.data];
      this.repeatLastSort();
    }

    return this.data;
  }

  public setRow(index: number, item: any): any[] {
    if(this.hasData && index > -1 && index < this.data.length) {
      this.data[index] = item;
      this.data = [...this.data];

      this.repeatLastSort();
    }

    return this.data;
  }

  public assignRow(index: number, item: any): any[] {
    if(this.hasData && index > -1 && index < this.data.length) {
      Object.assign(this.data[index], item);
      this.data = [...this.data];

      this.repeatLastSort();
    }

    return this.data;
  }

  public deleteRow(index: number): any[] {
    if(this.hasData && index > -1 && index < this.data.length) {
      this.data.splice(index, 1);
      this.data = [...this.data];

      this.repeatLastSort();
    }

    return this.data;
  }

  public querySetRow(item: any, predicate: (item: any) => boolean): any[] {
    const row: any = this.findRow(predicate);

    if(row != null) {
      const index: number = this.data.indexOf(row);
      this.data[index] = item;
      this.data = [...this.data];

      this.repeatLastSort();
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

      this.data = [...this.data];
    }

    return this.data;
  }

  public queryAssignRow(item: any, predicate: (item: any) => boolean): any[] {
    const row: any = this.findRow(predicate);

    if(row != null) {
      const index: number = this.data.indexOf(row);
      Object.assign(this.data[index], item);
      this.data = [...this.data];
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

      this.data = [...this.data];
    }

    return this.data;
  }

  public queryDeleteRow(predicate: (item: any) => boolean): any[] {
    const row: any = this.findRow(predicate);

    if(row != null) {
      const index: number = this.data.indexOf(row);
      this.data.splice(index, 1);
      this.data = [...this.data];
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

      this.data = [...this.data];
    }

    return this.data;
  }

  public repeatLastSort(): void {
    if(this._lastSortFunc != null) {
      this._lastSortFunc();
    }
  }

  onSort(sortFunc: Function): void {
    sortFunc();
    this._lastSortFunc = sortFunc;
  }

  onFilter(cell: TableCell, filterValue: any): void {
    let filteredData: any[];

    filteredData = this.data.filter((data: any) => {
      let result: boolean;
      const dataValue: any = data[cell.prop];

      switch(cell.type) {
        case "number":
          result = dataValue === filterValue;
          break;

        case "boolean":
        case "select":
          result = filterValue != null ? dataValue === filterValue : true;
          break;

        default:
          result = `${dataValue}`.toLowerCase().includes(`${filterValue}`.toLowerCase());
          break;
      }

      return result;
    });

    this._filteredData = filteredData ?? null;
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

  public get rowActionsTemplate(): TemplateRef<any> {
    return this._rowActionsTemplate;
  }
}