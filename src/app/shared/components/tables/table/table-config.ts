import { TableCell } from "./table-cell";

export class TableConfig<T = any> {
  private _settings: TableConfigSettings<T>;
  private _dataKey: any;

  public constructor(settings?: TableConfigSettings<T>) {
    this._settings = settings;
  }

  public setCells(cells: TableCell[]) {
    if(this._settings == null) {
      this._settings = { cells };
    }
    else {
      this._settings.cells = cells;
    }
  }

  public setData(data: T[]) {
    if(this._settings == null) {
      this._settings = { data };
    }
    else {
      this._settings.data = data;
    }
  }

  public get data(): T[] {
    return this._settings?.data ?? null;
  }

  public get hasData(): boolean {
    return this._settings?.data?.length > 0 ?? false;
  }

  public get dataKey(): any {
    if(this._dataKey == null) {
      if(this._settings?.dataKey != null && this.hasData) {
        this._dataKey = this._settings.dataKey(this._settings.data[0]);
      }
    }

    return this._dataKey;
  }

  public get hasDataKey(): boolean {
    return this.dataKey != null;
  }

  public get cells(): TableCell[] {
    return this._settings?.cells ?? null;
  }

  public get hasCells(): boolean {
    return this._settings?.cells?.length > 0 ?? false;
  }
}

interface TableConfigSettings<T = any> {
  dataKey?: any;
  data?: T[];
  cells?: TableCell[];
}