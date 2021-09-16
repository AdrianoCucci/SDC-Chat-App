export interface TableCell {
  header?: string;
  valueField?: string;
  valueType?: CellValueType;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  cssClass?: string;
}

type CellValueType = "text" | "number" | "boolean" | "date" | "time" | "datetime-local" | "select";