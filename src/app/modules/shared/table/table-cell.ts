import { TableColumn } from "@swimlane/ngx-datatable";

export interface TableCell extends TableColumn {
  type?: CellValueType;
  filterable?: boolean;
  hidden?: boolean;
  selectOptions?: CellSelectOptions;
}

type CellValueType = "text" | "number" | "boolean" | "date" | "time" | "datetime-local" | "select";

interface CellSelectOptions {
  options?: any[];
  displayKey?: string;
  valueKey?: string;  
}