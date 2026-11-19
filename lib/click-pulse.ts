type Box = { left: number; top: number; width: number; height: number }

export type PulseGeometry = { x: number; y: number; size: number }

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max)

// Where the pulse starts inside the button, and how wide it must grow to reach every corner.
export function getPulseGeometry(box: Box, clientX: number, clientY: number): PulseGeometry {
  const x = clamp(clientX - box.left, box.width)
  const y = clamp(clientY - box.top, box.height)
  const farX = Math.max(x, box.width - x)
  const farY = Math.max(y, box.height - y)
  return { x, y, size: Math.ceil(2 * Math.hypot(farX, farY)) }
}

export function startClickPulse(element: HTMLElement, clientX: number, clientY: number) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const { x, y, size } = getPulseGeometry(element.getBoundingClientRect(), clientX, clientY)
  const pulse = document.createElement('span')
  pulse.className = 'action-pulse'
  pulse.setAttribute('aria-hidden', 'true')
  pulse.style.left = `${x}px`
  pulse.style.top = `${y}px`
  pulse.style.width = `${size}px`
  pulse.style.height = `${size}px`
  pulse.addEventListener('animationend', () => pulse.remove(), { once: true })
  element.appendChild(pulse)
}
