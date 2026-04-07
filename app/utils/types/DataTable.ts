import type { ColumnProps } from 'primevue/column';
import type {
  DataTableFilterMetaData,
  DataTableOperatorFilterMetaData,
  DataTableProps,
} from 'primevue/datatable';
import type { Ref, StyleValue, VNode, VueElement } from 'vue';

export const rowsPerPage = [5, 10, 25, 50, 100, 200] as const;
type CallbackFunctionComponent = (
  ...args: any[]
) => VueElement | VNode | undefined;
export type IRows = (typeof rowsPerPage)[number];
export type IComponent =
  | VueElement
  | VNode
  | CallbackFunctionComponent
  | undefined;
export type IDataType = 'text' | 'date' | 'numeric' | 'boolean' | undefined;
export type IValueFormatter = 'date' | 'currency' | undefined;
export type INumericFormat = 'decimal' | 'currency' | 'percentage' | undefined;
export type IFilterDisplay = 'menu' | 'row';
export type IFilterColumn = {
  field: string;
  filterModel: DataTableFilterMetaData | DataTableOperatorFilterMetaData;
};
export type IFilterGlobal = {
  value: string;
  fields: string[];
};
export interface IColumnGroup {
  header?: string | undefined;
  headerStyle?: string | undefined;
  footer?: any | undefined;
  footerStyle?: string | undefined;
  rowspan?: number | undefined;
  colspan?: number | undefined;
}
export type IPaginatorType = 'simple' | 'basic' | 'full';

export interface CustomColumnProps extends ColumnProps {
  /**
   * Type of data. It's value is related to PrimeVue.filterMatchModeOptions config.
   */
  dataType?: IDataType | undefined;
  numericFormat?: INumericFormat;
  dateFormat?: string | undefined;
  bodyComponent?: IComponent | undefined;
  filterable?: boolean | undefined;
  filterComponent?: IComponent | undefined;
  filterMatchModeDefault?: string;
  editorComponent?: IComponent | undefined;
}

export interface CustomDataTableProps extends DataTableProps {
  /**
   * @property columns
   * @description
   * columns should be an array of objects.
   */
  columns: CustomColumnProps[];
  paginatorType?: IPaginatorType | undefined;
  selectionPageOnly?: boolean | undefined;
  enableSeqNumColumn?: boolean | undefined;
  enableGlobalFilter?: boolean | undefined;
  enableColumnFilter?: boolean | undefined;
  enableColumnLoader?: boolean | undefined;
  enableColumnSelection?: boolean | undefined;
  enableColumnSort?: boolean | undefined;
  toolbarSComponents?: IComponent[] | undefined;
  toolbarCComponents?: IComponent[] | undefined;
  toolbarEComponents?: IComponent[] | undefined;
  rowGroupHComponent?: IComponent | undefined;
  rowGroupFComponent?: IComponent | undefined;
  footerComponent?: IComponent | undefined;
  columnGroupH?: IColumnGroup[][] | undefined;
  columnGroupF?: IColumnGroup[][] | undefined;
  rowExpansionComponent?: IComponent | undefined;
}

//#region InputDatatable
export type InputDatatableColumnTypes =
  | 'text'
  | 'display'
  | 'number'
  | 'date'
  | 'textarea'
  | 'switch'
  | 'mask'
  | 'select'
  | 'password';

export interface InputDatatableSchemaProps {
  field: string;
  label: string;
  type: InputDatatableColumnTypes;
  defaultVal?: any;
  disabled?: boolean;
  value?: any;
  style?: StyleValue;
  options?: any[];
  optionLabel?: string;
  showButtons?: boolean;
  change?: (value: any, index: any, items: any) => void;
  triggerChangeFields?: string[];
}
export type InputDatatableItemsType = Record<string, any>;
export interface InputDatatableProps {
  schema: InputDatatableSchemaProps[];
  modelValue: any[];
}
//#endregion InputDatatable
