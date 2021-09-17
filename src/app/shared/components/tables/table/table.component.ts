import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faSort, faSortAmountDown, faSortAmountUp } from '@fortawesome/free-solid-svg-icons';
import { TableCell } from './table-cell';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() public cells: TableCell[];
  @Input() public data: any[];

  public readonly sortNoneIcon: IconDefinition = faSort;
  public readonly sortAscIcon: IconDefinition = faSortAmountUp;
  public readonly sortDescIcon: IconDefinition = faSortAmountDown;
}