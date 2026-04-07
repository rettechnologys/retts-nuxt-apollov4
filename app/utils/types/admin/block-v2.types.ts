export type BlockType =
  | 'wrapper'
  | 'text'
  | 'button'
  | 'input'
  | 'image'
  | 'divider'

export interface ShowIfCondition {
  field?: string
  op: 'eq' | 'not' | 'includes' | 'truthy' | 'and' | 'or'
  value?: unknown
  conditions?: ShowIfCondition[]
}

export interface FieldOption {
  label: string
  tw?: string
  value?: unknown
}

export interface FieldDef {
  key: string
  label?: string
  type: 'segment' | 'select' | 'toggle' | 'spacing-box' | 'spacing-single' | 'sizing' | 'color-picker' | 'text' | 'icon-picker'
  options?: FieldOption[]
  twPrefix?: string
  tw?: string
  placeholder?: string
  showIf?: ShowIfCondition
}

export interface FieldGroup {
  group: string
  collapsed: boolean
  fields: FieldDef[]
}

export interface SpacingValue {
  top: string | number
  right: string | number
  bottom: string | number
  left: string | number
}

export interface BlockStyle {
  class?: string
  pt?: Record<string, { class?: string }>
}

export interface BlockData {
  source: 'static' | 'api' | 'store'
  endpoint?: string
  value?: unknown
}

export interface BlockNode {
  id: string
  type: BlockType
  label?: string
  pv?: Record<string, unknown>
  style?: BlockStyle
  styleProps?: Record<string, unknown>
  data?: BlockData
  children?: BlockNode[]
}