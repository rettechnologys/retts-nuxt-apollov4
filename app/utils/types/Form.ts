// import { SignaturePadProps } from '@/components/SignaturePad/Types';
import type {
  AutoCompleteCompleteEvent,
  AutoCompleteProps,
} from 'primevue/autocomplete';
import type { ButtonProps } from 'primevue/button';
import type { CalendarProps } from 'primevue/calendar';
import type { CascadeSelectProps } from 'primevue/cascadeselect';
import type { CheckboxProps } from 'primevue/checkbox';
import type { ChipsProps } from 'primevue/chips';
import type { ColorPickerProps } from 'primevue/colorpicker';
import type { DropdownFilterEvent, DropdownProps } from 'primevue/dropdown';
import type { FieldsetProps } from 'primevue/fieldset';
import type { FileUploadProps } from 'primevue/fileupload';
import type { InputMaskProps } from 'primevue/inputmask';
import type { InputNumberProps } from 'primevue/inputnumber';
import type { InputOtpProps } from 'primevue/inputotp';
import type { InputSwitchProps } from 'primevue/inputswitch';
import type { InputTextProps } from 'primevue/inputtext';
import type { KnobProps } from 'primevue/knob';
import type { ListboxProps } from 'primevue/listbox';
import type { MultiSelectProps } from 'primevue/multiselect';
import type { PasswordProps } from 'primevue/password';
import type { RadioButtonProps } from 'primevue/radiobutton';
import type { RatingProps } from 'primevue/rating';
import type { SelectButtonProps } from 'primevue/selectbutton';
import type { SliderProps } from 'primevue/slider';
import type { TextareaProps } from 'primevue/textarea';
import type { ToggleButtonProps } from 'primevue/togglebutton';
import type { TreeSelectProps } from 'primevue/treeselect';
import type { VNode } from 'vue';
import CodeMirror from 'vue-codemirror6';

export type IFormStatus = 'initial' | 'submiting' | 'success' | 'failure';
export type IMessage = string | string[] | undefined;
export interface IFormState {
  status: IFormStatus;
  message?: IMessage;
  isReset?: boolean;
  uploadProgress?: number;
  downloadProgress?: number;
}
export type IFormTabsModes = 'tabs' | 'steps';
export type IFormTabsHeader = 'header' & 'props';

export interface IFormTabsHeaderProps {
  index: number;
  active: number;
  headerClass?: string;
  headerTitle?: string;
  headerTitleClass?: string;
  headerIcon?: string;
  headerIconClass?: string;
  clickCallback?: (event: Event) => void;
}
export interface IFormDependantFields {
  matchValue: string | boolean | any;
  fields: IFormField[];
}

export const initialFormState: IFormState = {
  status: 'initial',
};

export interface IFormTabsHeaderProps {
  index: number;
  active: number;
  headerClass?: string;
  headerTitle?: string;
  headerTitleClass?: string;
  headerIcon?: string;
  headerIconClass?: string;
  clickCallback?: (event: Event) => void;
}

//#region IForm Handler Type
type IFormInitHandler = { 'handle-init'?: (payload: any) => void };
type IFormInitDatatableHandler = {
  'handle-init-datatable'?: (payload?: { name?: string; value?: any }) => void;
};

type IFormEventHandler = {
  'handle-click'?: (payload?: any) => void;
  'handle-select'?: (payload: {
    value: any;
    cb?: any;
    fieldArrIndex?: number;
    name?: string;
    waterfallFields?: string[];
  }) => void;
  'handle-change'?: (payload: {
    value: any;
    values?: any;
    cb?: any;
    name?: string;
  }) => void;
  'handle-unselect'?: (payload: {
    value: any;
    cb?: any;
    name?: string;
    waterfallFields?: string[];
  }) => void;
};

type WithDropdownFilter = {
  'handle-dropdown-filter'?: (payload: {
    event: {
      originalEvent?: DropdownFilterEvent['originalEvent'] | undefined;
      value: any;
    };
    name?: string;
    currentValue?: any;
  }) => void;
};

type DropdownFilterHandler = WithDropdownFilter & IFormInitDatatableHandler;
export type AutoCompleteCompleteHandlerProps = {
  event: AutoCompleteCompleteEvent;
  name?: string;
};
export type RemoteFilterHandlerProps = {
  event: Partial<DropdownFilterEvent>;
  name?: string;
  currentValue?: any;
};
type AutoCompleteEventHandler = IFormEventHandler &
  IFormInitDatatableHandler & {
    'handle-complete'?: (payload: AutoCompleteCompleteHandlerProps) => void;
  };

export type IFormFieldTabs = {
  label?: string;
  headerSlots?: {
    header: any;
    headerClass?: string;
    headerIcon?: string;
    headerIconClass?: string;
    headerTitleClass?: string;
  };
  fields: IFormField[];
};
//#endregion

//#region Helper Type
export interface IOptionRadioCheckbox {
  text: string;
  value: string | boolean | number;
  checked?: string | boolean;
}

export type IOptionSelect = Pick<IOptionRadioCheckbox, 'text' | 'value'>;
type WithOptionsType = {
  options?: IOptionSelect[];
};

type WithLazyProps = {
  lazy?: boolean;
};
type WithDependantFields = {
  dependantFields?: IFormDependantFields[];
};

type WithDatatable = {
  /**
   * @description
   * Please use Wrapper component instead. For Simpler Handling
   * @example
   * ```
   * // Userlist.vue
   * <template>
   *   <Datatable
   *     ...props
   *     ...emitter
   *   />
   * </template>
   * ```
   *
   * Then Pass ``` <UserList /> ``` here
   */
  dataTableComponent?: VNode;
};
export type TRowGroupHeaderValues = {
  value: string;
  class?: string | string;
  style?: string | object;
};
type FieldArray = {
  atLeastOne?: boolean;
  showOne?: boolean;
  showButton?: boolean;
  fieldArray?: IFormField[];
  disabled?: boolean;
  display?: 'table' | 'fieldset' | 'draggable' | 'none';
  rowGroup?: boolean;
  rowGroupHeaderValues?: TRowGroupHeaderValues[];
  groupRowsBy?: string;
  rowGroupHeaderClass?: string[];
  componentProps?: FieldsetProps;
};

export type FunctionalComponent = (
  data: any,
  setter: (value: any) => void,
  fieldArrIndex?: number,
) => VNode;
//#endregion

//#region Base Types
type BaseAutoCompleteField = AutoCompleteProps &
  WithDependantFields & {
    datatable?: boolean | null;
    componentSlots?: any;
    keysToExtract?: string[];
    waterfallFields?: string[];
    optionValue?: string;
  };
type BaseSelectButtonType = SelectButtonProps & {
  componentSlots?: any;
  dependantFields?: IFormDependantFields[];
  lazy?: boolean;
  waterfallFields?: string[];
  loading?: boolean;
};
type BaseSliderType = SliderProps & {
  componentSlots?: any;
};
type BaseDropDownType = DropdownProps &
  WithDependantFields &
  WithLazyProps & {
    componentSlots?: any;
    datatable?: boolean | null;
    keysToExtract?: string[];
    waterfallFields?: string[];
  };
type BaseCascadeSelectType = CascadeSelectProps &
  WithDependantFields &
  WithLazyProps & {
    componentSlots?: any;
    datatable?: boolean | null;
    keysToExtract?: string[];
    waterfallFields?: string[];
  };

type BaseCheckboxType = CheckboxProps & {
  atLeastOne?: boolean;
};

type CodeMirrorProps = InstanceType<typeof CodeMirror>['$props'];

type BaseInputGroupType = InputTextProps & {
  startAddon?: string;
  endAddon?: string;
};
type BaseMultiSelectType = MultiSelectProps & {
  componentSlots?: {
    chip?: VNode | undefined;
    option?: VNode | undefined;
    value?: VNode | undefined;
  };
  datatable?: boolean | null;
  keysToExtract?: string[];
};
type BaseToggleButtonType = ToggleButtonProps & WithDependantFields;
type BaseTreeSelectType = TreeSelectProps &
  WithDependantFields &
  WithLazyProps & {
    componentSlots?: any;
    waterfallFields?: string[];
  };
type BaseListboxType = ListboxProps &
  WithDependantFields &
  WithLazyProps & {
    componentSlots?: any;
    waterfallFields?: string[];
  };

type BaseFileUploadType = FileUploadProps & {
  componentSlots?: any;
  type?: 'rich' | undefined;
};
//#endregion

//#region Extended Types
type AutoCompleteType = BaseAutoCompleteField;
type ButtonType = ButtonProps &
  IFormEventHandler & {
    formValues?: boolean;
  };
type ChipsType = ChipsProps & WithOptionsType;
type CheckboxType = BaseCheckboxType & WithOptionsType & WithDependantFields;
type CascadeSelectType = BaseCascadeSelectType;
export type ComponentType = {
  component: VNode | FunctionalComponent;
  formValues?: boolean;
  formSetValues?: boolean;
};
type DropDownType = BaseDropDownType;
type CronInputType = BaseDropDownType;
type MultiSelectType = BaseMultiSelectType & WithLazyProps;
type RadioButtonType = RadioButtonProps & WithOptionsType & WithDependantFields;
type SwitchType = InputSwitchProps & WithDependantFields;
export type TabsType = {
  fields: IFormFieldTabs[];
};
type TextEditorProps = {
  modelValue?: string;
  unique?: string;
  height?: number;
  disabled?: boolean;
};
// type SignaturePadType = SignaturePadProps;
type SignaturePadType = any;
//#endregion

//#region IFormField Compound Types
export type ComponentPropsMapping = {
  autocomplete: AutoCompleteType;
  tabs: TabsType;
  button: ButtonType;
  calendar: CalendarProps;
  'cascade-select': CascadeSelectType;
  chips: ChipsType;
  checkbox: CheckboxType;
  'color-picker': ColorPickerProps;
  component: ComponentType;
  cron: CronInputType;
  codeEditor: any;
  dropdown: DropDownType;
  fileUpload: BaseFileUploadType;
  fieldArray: FieldArray;
  'inject-slot': any;
  'input-group': BaseInputGroupType;
  'input-datatable': FieldArray;
  knob: KnobProps;
  listbox: BaseListboxType;
  otp: InputOtpProps;
  mask: InputMaskProps;
  multiSelect: MultiSelectType;
  number: InputNumberProps;
  password: PasswordProps;
  radioButton: RadioButtonType;
  rating: RatingProps;
  switch: SwitchType;
  'select-button': BaseSelectButtonType;
  signature: SignaturePadType;
  slider: BaseSliderType;
  text: InputTextProps;
  'text-area': TextareaProps;
  'text-editor': TextEditorProps;
  'toggle-button': BaseToggleButtonType;
  'tree-select': BaseTreeSelectType;
};

type ComponentProps<T extends keyof ComponentPropsMapping> =
  ComponentPropsMapping[T];

type FieldBase = {
  label?: string;
  name: string;
  placeholder?: string;
  as: keyof ComponentPropsMapping;
  rules?: string;
  type?: string;
  value?: any;
  fieldArrIndex?: number;
  parentFieldClass?: string;
  fieldClass?: string;
  labelClass?: string;
  parentInputClass?: string;
  inputClass?: string;
  errorInputClass?: string;
  isLazyValidation?: boolean;
};

type FieldHandlers<T extends keyof ComponentPropsMapping> = T extends 'dropdown'
  ? DropdownFilterHandler & IFormEventHandler & WithDatatable
  : T extends 'button'
    ? IFormEventHandler
    : T extends 'multiSelect'
      ? DropdownFilterHandler & IFormEventHandler & WithDatatable
      : T extends 'autocomplete'
        ? WithDatatable & IFormEventHandler & AutoCompleteEventHandler
        : T extends 'cascade-select' | 'select-button'
          ? IFormInitHandler
          : T extends 'tree-select' | 'listbox'
            ? IFormInitHandler & IFormEventHandler & WithDropdownFilter
            : T extends
                  | 'text-editor'
                  | 'text-area'
                  | 'text'
                  | 'fileUpload'
                  | 'password'
                  | 'knob'
                  | 'radioButton'
                  | 'signature'
              ? IFormEventHandler
              : unknown;

type Field<T extends keyof ComponentPropsMapping> = FieldBase & {
  as: T;
  props?: ComponentProps<T>;
} & FieldHandlers<T>;

export type IFormField = {
  [K in keyof ComponentPropsMapping]: Field<K>;
}[keyof ComponentPropsMapping];

export type FormSchemaWithFields = {
  fields: IFormField[];
  tabs?: never;
};

export type IFormFieldTabsWithFields = IFormFieldTabs & {
  fields: IFormField[];
};
export type FormSchemaWithTabs = {
  tabs: IFormFieldTabsWithFields[];
  fields?: never;
};

export type FormSchema = FormSchemaWithTabs | FormSchemaWithFields;

// export interface IFormField {
//   label: string;
//   name: string;
//   as: string;
//   fieldArray?: IFormField[];
//   rules?: string;
//   parentFieldClass?: string;
//   fieldClass?: string;
//   labelClass?: string;
//   parentInputClass?: string;
//   inputClass?: string;
//   errorInputClass?: string;
//   optionSelect?: IOptionSelect[];
//   optionRadioCheckbox?: IOptionRadioCheckbox[];
//   isLazyValidation?: boolean;
//   maskOptions?: string;
//   disabled?: boolean;
//   placeholder?: string;
//   type?: any;
//   autocomplete?: string;
//   onButtonClick?: () => void;
// }
