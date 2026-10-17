export function formatCountdown(totalSeconds: number) {
  return [Math.floor(totalSeconds / 60), totalSeconds % 60]
    .map((value) => String(value).padStart(2, '0')).join(':')
}

export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours > 0 ? `${hours} h` : '', minutes > 0 ? `${minutes} min` : '', seconds > 0 ? `${seconds} s` : '']
    .filter(Boolean).join(' ') || '0 s'
}
