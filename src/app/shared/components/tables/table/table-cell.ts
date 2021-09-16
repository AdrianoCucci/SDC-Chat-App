export interface TableCell<T = any> {
  header?: string;
  value?: (data: T) => any;
  displayValue?: (data: T) => any;
  valueType?: CellValueType;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  cssClass?: string;
}

type CellValueType = "text" | "number" | "boolean" | "date" | "time" | "datetime-local" | "select";