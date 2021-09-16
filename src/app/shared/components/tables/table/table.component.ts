import { Component, Input } from '@angular/core';
import { TableConfig } from './table-config';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() public config: TableConfig;
}