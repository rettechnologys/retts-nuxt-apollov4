import type { FieldGroup } from '@/utils/types/admin/block-v2.types'

export const TAILWIND_COLORS = [
  { label: 'White', tw: 'white', hex: '#ffffff' },
  { label: 'Slate 50', tw: 'slate-50', hex: '#f8fafc' },
  { label: 'Slate 100', tw: 'slate-100', hex: '#f1f5f9' },
  { label: 'Slate 200', tw: 'slate-200', hex: '#e2e8f0' },
  { label: 'Slate 500', tw: 'slate-500', hex: '#64748b' },
  { label: 'Slate 900', tw: 'slate-900', hex: '#0f172a' },
  { label: 'Blue 50', tw: 'blue-50', hex: '#eff6ff' },
  { label: 'Blue 500', tw: 'blue-500', hex: '#3b82f6' },
  { label: 'Blue 900', tw: 'blue-900', hex: '#1e3a8a' },
  { label: 'Indigo 500', tw: 'indigo-500', hex: '#6366f1' },
  { label: 'Purple 500', tw: 'purple-500', hex: '#a855f7' },
  { label: 'Pink 500', tw: 'pink-500', hex: '#ec4899' },
  { label: 'Red 500', tw: 'red-500', hex: '#ef4444' },
  { label: 'Orange 500', tw: 'orange-500', hex: '#f97316' },
  { label: 'Yellow 500', tw: 'yellow-500', hex: '#eab308' },
  { label: 'Green 500', tw: 'green-500', hex: '#22c55e' },
  { label: 'Teal 500', tw: 'teal-500', hex: '#14b8a6' },
  { label: 'Black', tw: 'black', hex: '#000000' },
  { label: 'Transparent', tw: 'transparent', hex: 'transparent' },
]

export const SPACING_SCALE = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60', '64', '72', '80', '96', 'auto', 'px']

export const SIZING_OPTIONS = ['auto', 'full', 'screen', 'min', 'max', 'fit', '1/2', '1/3', '2/3', '1/4', '3/4', 'px', '0', '1', '2', '4', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64', '72', '80', '96']

export const MAX_WIDTH_OPTIONS = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full', 'screen', 'prose']

export const wrapperConfig: FieldGroup[] = [
  {
    group: 'Layout',
    collapsed: false,
    fields: [
      {
        key: 'display', label: 'Display', type: 'segment',
        options: [
          { label: 'Flex', tw: 'flex' },
          { label: 'Grid', tw: 'grid' },
          { label: 'Block', tw: 'block' },
        ]
      },
      {
        key: 'direction', label: 'Direction', type: 'segment',
        showIf: { field: 'display', op: 'eq', value: 'Flex' },
        options: [
          { label: 'Row', tw: 'flex-row' },
          { label: 'Col', tw: 'flex-col' },
        ]
      },
      {
        key: 'wrap', label: 'Wrap', type: 'toggle', tw: 'flex-wrap',
        showIf: { field: 'display', op: 'eq', value: 'Flex' },
      },
      {
        key: 'cols', label: 'Columns', type: 'select',
        showIf: { field: 'display', op: 'eq', value: 'Grid' },
        options: [
          { label: '1', tw: 'grid-cols-1' },
          { label: '2', tw: 'grid-cols-2' },
          { label: '3', tw: 'grid-cols-3' },
          { label: '4', tw: 'grid-cols-4' },
          { label: '6', tw: 'grid-cols-6' },
          { label: '12', tw: 'grid-cols-12' },
        ]
      },
      {
        key: 'align', label: 'Align', type: 'segment',
        showIf: {
          op: 'or', conditions: [
            { field: 'display', op: 'eq', value: 'Flex' },
            { field: 'display', op: 'eq', value: 'Grid' },
          ]
        },
        options: [
          { label: 'Start', tw: 'items-start' },
          { label: 'Center', tw: 'items-center' },
          { label: 'End', tw: 'items-end' },
          { label: 'Stretch', tw: 'items-stretch' },
        ]
      },
      {
        key: 'justify', label: 'Justify', type: 'segment',
        showIf: {
          op: 'or', conditions: [
            { field: 'display', op: 'eq', value: 'Flex' },
            { field: 'display', op: 'eq', value: 'Grid' },
          ]
        },
        options: [
          { label: 'Start', tw: 'justify-start' },
          { label: 'Center', tw: 'justify-center' },
          { label: 'End', tw: 'justify-end' },
          { label: 'Between', tw: 'justify-between' },
        ]
      },
      {
        key: 'gap', label: 'Gap', type: 'spacing-single', twPrefix: 'gap',
        showIf: {
          op: 'or', conditions: [
            { field: 'display', op: 'eq', value: 'Flex' },
            { field: 'display', op: 'eq', value: 'Grid' },
          ]
        },
      },
    ]
  },
  {
    group: 'Spacing',
    collapsed: false,
    fields: [
      { key: 'padding', label: 'Padding', type: 'spacing-box', twPrefix: 'p' },
      { key: 'margin', label: 'Margin', type: 'spacing-box', twPrefix: 'm' },
    ]
  },
  {
    group: 'Sizing',
    collapsed: true,
    fields: [
      { key: 'width', label: 'Width', type: 'sizing', twPrefix: 'w' },
      { key: 'maxWidth', label: 'Max width', type: 'sizing', twPrefix: 'max-w' },
      { key: 'height', label: 'Height', type: 'sizing', twPrefix: 'h' },
    ]
  },
  {
    group: 'Background',
    collapsed: true,
    fields: [
      { key: 'bg', label: 'Color', type: 'color-picker', twPrefix: 'bg' },
    ]
  },
  {
    group: 'Border',
    collapsed: true,
    fields: [
      {
        key: 'rounded', label: 'Rounded', type: 'select',
        options: [
          { label: 'None', tw: 'rounded-none' },
          { label: 'SM', tw: 'rounded-sm' },
          { label: 'MD', tw: 'rounded-md' },
          { label: 'LG', tw: 'rounded-lg' },
          { label: 'XL', tw: 'rounded-xl' },
          { label: '2XL', tw: 'rounded-2xl' },
          { label: 'Full', tw: 'rounded-full' },
        ]
      },
      { key: 'border', label: 'Show border', type: 'toggle', tw: 'border' },
      {
        key: 'borderColor', label: 'Border color', type: 'color-picker', twPrefix: 'border',
        showIf: { field: 'border', op: 'truthy' },
      },
    ]
  },
  {
    group: 'Shadow',
    collapsed: true,
    fields: [
      {
        key: 'shadow', label: 'Shadow', type: 'select',
        options: [
          { label: 'None', tw: 'shadow-none' },
          { label: 'SM', tw: 'shadow-sm' },
          { label: 'MD', tw: 'shadow-md' },
          { label: 'LG', tw: 'shadow-lg' },
          { label: 'XL', tw: 'shadow-xl' },
          { label: '2XL', tw: 'shadow-2xl' },
        ]
      },
      {
        key: 'overflow', label: 'Overflow', type: 'segment',
        options: [
          { label: 'Visible', tw: 'overflow-visible' },
          { label: 'Hidden', tw: 'overflow-hidden' },
          { label: 'Auto', tw: 'overflow-auto' },
        ]
      },
    ]
  },
  {
    group: 'Custom class',
    collapsed: true,
    fields: [
      { key: 'customClass', label: 'Custom', type: 'text', placeholder: 'z-10 relative ...' },
    ]
  },
]

export const textConfig: FieldGroup[] = [
  {
    group: 'Content',
    collapsed: false,
    fields: [
      { key: 'content', label: 'Text', type: 'text', placeholder: 'Teks di sini...' },
      {
        key: 'tag', label: 'Tag', type: 'select',
        options: [
          { label: 'p', value: 'p' },
          { label: 'h1', value: 'h1' },
          { label: 'h2', value: 'h2' },
          { label: 'h3', value: 'h3' },
          { label: 'h4', value: 'h4' },
          { label: 'span', value: 'span' },
        ]
      },
    ]
  },
  {
    group: 'Typography',
    collapsed: false,
    fields: [
      {
        key: 'size', label: 'Size', type: 'select',
        options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl']
          .map(s => ({ label: s, tw: `text-${s}` }))
      },
      {
        key: 'weight', label: 'Weight', type: 'select',
        options: [
          { label: 'Light', tw: 'font-light' },
          { label: 'Normal', tw: 'font-normal' },
          { label: 'Medium', tw: 'font-medium' },
          { label: 'Semibold', tw: 'font-semibold' },
          { label: 'Bold', tw: 'font-bold' },
        ]
      },
      {
        key: 'align', label: 'Align', type: 'segment',
        options: [
          { label: 'Left', tw: 'text-left' },
          { label: 'Center', tw: 'text-center' },
          { label: 'Right', tw: 'text-right' },
        ]
      },
      { key: 'color', label: 'Color', type: 'color-picker', twPrefix: 'text' },
    ]
  },
]

export const buttonConfig: FieldGroup[] = [
  {
    group: 'PrimeVue props',
    collapsed: false,
    fields: [
      { key: 'label', label: 'Label', type: 'text', placeholder: 'Button label' },
      {
        key: 'severity', label: 'Severity', type: 'select',
        options: [
          { label: 'Primary', value: 'primary' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Success', value: 'success' },
          { label: 'Warning', value: 'warning' },
          { label: 'Danger', value: 'danger' },
          { label: 'Info', value: 'info' },
        ]
      },
      { key: 'rounded', label: 'Rounded', type: 'toggle', tw: '' },
      { key: 'outlined', label: 'Outlined', type: 'toggle', tw: '' },
      { key: 'icon', label: 'Icon', type: 'icon-picker' },
    ]
  },
  {
    group: 'Sizing',
    collapsed: true,
    fields: [
      {
        key: 'size', label: 'Size', type: 'select',
        options: [
          { label: 'Small', value: 'small' },
          { label: 'Normal', value: 'normal' },
          { label: 'Large', value: 'large' },
        ]
      },
    ]
  },
  {
    group: 'Passthrough (pt)',
    collapsed: true,
    fields: [
      { key: 'ptRoot', label: 'root', type: 'text', placeholder: 'w-full font-bold ...' },
      { key: 'ptLabel', label: 'label', type: 'text', placeholder: 'text-sm ...' },
    ]
  },
]

export function configFor(type: string): FieldGroup[] {
  const map: Record<string, FieldGroup[]> = {
    wrapper: wrapperConfig,
    text: textConfig,
    button: buttonConfig,
  }
  return map[type] ?? []
}