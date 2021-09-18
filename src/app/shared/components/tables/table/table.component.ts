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

  @ContentChildren(TemplateDirective) private readonly _cellTemplates: QueryList<TemplateDirective>;

  private _filteredData: any[];

  ngAfterViewInit(): void {
    if(this.cells?.length > 0) {
      this._cellTemplates.forEach((td: TemplateDirective) => {
        const prop: string = td.name;
        const cell: TableCell = this.cells.find((cell: TableCell) => cell.prop === prop);

        if(cell != null) {
          cell.cellTemplate = td.template;
        }
      });
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

  public get rows(): any[] {
    return this._filteredData ?? this.data;
  }
}