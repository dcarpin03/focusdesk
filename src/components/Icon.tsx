type IconName = 'leaf' | 'study' | 'clock' | 'folder' | 'check' | 'trash' | 'chevron'

const paths: Record<IconName, string> = {
  leaf: 'M19.5 3.5C10 3.5 4 7 4 13a7 7 0 0 0 7 7c6 0 9-7 8.5-16.5ZM4 22 15 11',
  study: 'm3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9',
  clock: 'M12 7v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  folder: 'M3 7V5h6l2 2h10v13H3V7Zm0 3h18',
  check: 'm6 12 4 4 8-8M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',
  chevron: 'm9 5 7 7-7 7'
}

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <path d={paths[name]} />
    </svg>
  )
}
