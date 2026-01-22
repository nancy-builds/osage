export const formatTime = (iso: string) => {
  const date = new Date(iso)

  const formatted = date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return formatted.replace(',', ' at')
}
