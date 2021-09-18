import { AfterViewInit, Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faSort, faSortAmountDown, faSortAmountUp } from '@fortawesome/free-solid-svg-icons';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { TemplateDirective } from 'src/app/shared/directives/template.directive';
import { TableCell } from './table-cell';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit {
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
          result = `${dataValue}`.includes(filterValue);
          break;
      }

      return result;
    });

    this._filteredData = filteredData ?? null;
  }

  public get initialized(): boolean {
    return this._initialized;
  }

  public get rows(): any[] {
    return this._filteredData ?? this.data;
  }

  public get rowActionsTemplate(): TemplateRef<any> {
    return this._rowActionsTemplate;
  }
}