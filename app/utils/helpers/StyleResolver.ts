import type { ShowIfCondition, FieldGroup, SpacingValue } from '@/utils/types/admin/block-v2.types'

export function evalShowIf(
  cond: ShowIfCondition,
  values: Record<string, unknown>
): boolean {
  switch (cond.op) {
    case 'eq':
      return values[cond.field!] === cond.value
    case 'not':
      return values[cond.field!] !== cond.value
    case 'includes':
      return Array.isArray(cond.value)
        ? cond.value.includes(values[cond.field!])
        : (values[cond.field!] as unknown[])?.includes(cond.value) ?? false
    case 'truthy':
      return !!values[cond.field!]
    case 'and':
      return (cond.conditions ?? []).every(c => evalShowIf(c, values))
    case 'or':
      return (cond.conditions ?? []).some(c => evalShowIf(c, values))
    default:
      return true
  }
}

export function resolveClass(
  values: Record<string, unknown>,
  config: FieldGroup[]
): string {
  const classes: string[] = []

  for (const group of config) {
    for (const field of group.fields) {
      if (field.showIf && !evalShowIf(field.showIf, values)) continue

      const val = values[field.key]
      if (val === undefined || val === null || val === '') continue

      switch (field.type) {
        case 'segment':
        case 'select': {
          const opt = field.options?.find(o => o.label === val)
          if (opt?.tw) classes.push(opt.tw)
          break
        }
        case 'toggle': {
          if (val === true && field.tw) classes.push(field.tw)
          break
        }
        case 'spacing-box': {
          const { top: t, right: r, bottom: b, left: l } = val as SpacingValue
          const px = field.twPrefix!
          if (t === r && r === b && b === l) {
            classes.push(`${px}-${t}`)
          } else {
            if (t === b) classes.push(`${px}y-${t}`)
            else { classes.push(`${px}t-${t}`); classes.push(`${px}b-${b}`) }
            if (r === l) classes.push(`${px}x-${r}`)
            else { classes.push(`${px}r-${r}`); classes.push(`${px}l-${l}`) }
          }
          break
        }
        case 'spacing-single': {
          classes.push(`${field.twPrefix}-${val}`)
          break
        }
        case 'sizing':
        case 'color-picker': {
          classes.push(`${field.twPrefix}-${val}`)
          break
        }
        case 'text': {
          classes.push(val as string)
          break
        }
      }
    }
  }

  return classes.filter(Boolean).join(' ')
}

export function hasActiveFields(
  values: Record<string, unknown>,
  config: FieldGroup[]
): boolean {
  return config.some(group =>
    group.fields.some(field => {
      const val = values[field.key]
      return val !== undefined && val !== null && val !== '' && val !== false
    })
  )
}