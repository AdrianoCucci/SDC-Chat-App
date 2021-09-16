import { Component, Input } from '@angular/core';
import { faSort, faSortAmountDown, faSortAmountUp, IconDefinition, IconLookup } from '@fortawesome/free-solid-svg-icons';
import { TableCell } from './table-cell';
import { TableConfig } from './table-config';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  public readonly sortIcon: IconDefinition = faSort;
  public readonly sortIconUp: IconDefinition = faSortAmountUp;
  public readonly sortIconDown: IconDefinition = faSortAmountDown;

  private _currentSortHeader: HTMLElement;

  @Input() public config: TableConfig;

  onSort(cell: TableCell, element: HTMLElement): void {
    if(cell.sortable) {
      this.updateSortHeaderElement(element);
      this.sortCellData(cell, element.getAttribute("sort") === "asc");
    }
  }

  private updateSortHeaderElement(element: HTMLElement) {
    if(this._currentSortHeader != null && element !== this._currentSortHeader) {
      this._currentSortHeader.removeAttribute("sort");
    }

    if(element.getAttribute("sort") === "asc") {
      element.setAttribute("sort", "desc");
    }
    else {
      element.setAttribute("sort", "asc");
    }

    this._currentSortHeader = element;
  }

  private sortCellData(cell: TableCell, ascending: boolean) {
    const ascendingMultiplier: number = ascending ? 1 : -1;

    this.config.data.sort((a: any, b: any) => {
      let result: number;

      const aValue: any = a[cell.valueField];
      const bValue: any = b[cell.valueField];

      if(aValue < bValue) {
        result = ascending ? -1 : 1;
      }
      else if(bValue > aValue) {
        result = ascending ? 1 : -1;
      }
      else {
        result = 0;
      }

      return result;
    });
  }
}