export const SECTION_COLORS = [
  { name: 'Azul', value: '#2563a6' },
  { name: 'Verde', value: '#287a43' },
  { name: 'Naranja', value: '#a95720' },
  { name: 'Morado', value: '#7952a3' },
  { name: 'Rosa', value: '#ad3974' },
  { name: 'Turquesa', value: '#167d83' }
] as const

export const DEFAULT_SECTION_COLOR = SECTION_COLORS[0].value

export const isSectionColor = (color: string) =>
  SECTION_COLORS.some((option) => option.value === color)
