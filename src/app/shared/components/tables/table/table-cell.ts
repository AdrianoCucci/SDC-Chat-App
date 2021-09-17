import { TableColumn } from "@swimlane/ngx-datatable";

export interface TableCell extends TableColumn {
  type?: CellValueType;
  filterable?: boolean;
  hidden?: boolean;
}

type CellValueType = "text" | "number" | "boolean" | "date" | "time" | "datetime-local" | "select";