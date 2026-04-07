export interface IVueTree {
  tree: any[];
  defaultAttrs?: any;
  checkboxLinkage?: boolean;
  autoReload?: boolean;
  dragImageOffsetX?: string;
  dragImageOffsetY?: string;
  enableDragNodeOut?: boolean;
  enableDropExternalElement?: boolean;
  enableTouchSupport?: boolean;
  dropToMove?: boolean;
  treeId?: string;
  animationDuration?: string;
  multiSelect?: boolean;
  pressEnterToBlur?: boolean;
  fnLoadData?: (node: any) => void;
  fnIsDroppable?: (dragAndDrop: any) => void;
  fnBeforeDrag?: (node: any) => void;
  fnBeforeCheck?: (node: any) => void;
  fnBeforeUncheck?: (node: any) => void;
  fnBeforeSelect?: (node: any) => void;
  fnBeforeExpand?: (node: any) => void;
  fnBeforeCollpase?: (node: any) => void;
  fnBeforeContextMenu?: (node: any, event: any) => void;
  fnBeforeDrop?: (dragAndDrop: any) => void;
  fnAfterCalculate?: (node: any) => void;
  reload?: () => void;
  traverse?: (fnDoSomething: (node: any) => void) => void;
  getById?: (id: any) => any;
  getNestedTree?: () => any;
  getFlatTree?: () => any[];
  getSelected?: () => any[];
  getSelectedOne?: () => any;
  setAttr?: (node: any, key: string, val: any, subKey?: string) => void;
  getAttr?: (node: any, key: string, subKey?: string) => any;
  setTitle?: (node: any, title: string) => void;
  edit?: (node: any) => void;
  quitEdit?: (node: any) => void;
  getTitleElement?: (node: any) => any;
  focus?: (node: any) => void;
  blur?: (node: any) => void;
  deselect?: (node: any) => void;
  select?: (node: any) => void;
  hideContextMenuOnDisplay?: () => void;
  create?: (node: any, parentNode: any, pos?: number) => void;
  createAndEdit?: (node: any, parentNode: any, pos?: number) => void;
  remove?: (node: any) => void;
  move?: (
    node: any,
    fromParent: any,
    fromPos: any,
    toParent: any,
    toPos: any,
  ) => void;
  search?: (keyword: string, fnMatch?: (node: any) => boolean) => any[];
  sort?: (
    node: any,
    recursive: boolean,
    fnCompare?: (a: any, b: any) => number,
  ) => void;
  clearSearchResult?: () => void;
  expand?: (node: any) => void;
  expandAncestors?: (node: any) => void;
  collapse?: (node: any) => void;
  toggleDirectoryState?: (node: any) => void;
  getElement?: (node: any) => any;
  getOffset?: (node: any) => { left: number; top: number };
  setCheckboxState?: (node: any, state: boolean) => void;
  check?: (node: any) => void;
  uncheck?: (node: any) => void;
  toggleCheckbox?: (node: any) => void;
  getChecked?: () => any[];
  getUndetermined?: () => any[];
  getUnchecked?: () => any[];
  isTheTouchOperationFromTheTree?: (event: Event) => boolean;
  getDragFrom?: () => { treeId: string; nodeId: number } | null;
  //* Custom
  isLoading?: boolean;
  maxDept?: number;
  canRefresh?: boolean;
  canSearch?: boolean;
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canDetail?: boolean;
}

export interface IVueTreeNode {
  id: any;
  title: string;
  hasChild?: boolean;
  children?: any[];
  directoryState?: 'expanded' | 'collapsed' | 'loading';
  selected?: boolean;
  checkbox?: {
    show?: boolean;
    disable?: boolean;
    state: 'checked' | 'unchecked' | 'undetermined';
  };
  style?: {
    height?: string;
    indent?: string;
    fontSize?: string;
    hoverBgColor?: string;
    dragOverBgColor?: string;
    selectedBgColor?: string;
    switcherMarginRight?: string;
    iconMarginRight?: string;
    checkboxMarginRight?: string;
    extraFloatRight?: boolean;
    extraAlwaysVisible?: boolean;
    titleMaxWidth?: string;
    titleOverflow?: string;
    showIcon?: boolean;
    showSwitcher?: boolean;
  };
  __: {
    parent: object;
    path: any[];
    depth: number;
    pos: number;
    gpos: number;
    dpos: number;
    isVisible?: boolean;
    isEditing?: boolean;
    isSearchResult?: boolean;
    isDroppable?: boolean;
    dragOverArea?: string;
    mousex?: string;
    mousey?: string;
    titleTip?: string;
    titleMaxWidth?: string;
    customClasses?: any[];
  };
}
