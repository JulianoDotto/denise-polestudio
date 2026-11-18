import { cn } from './utils'

export type ActionButtonStyleOptions = {
  size: 'sm' | 'md' | 'lg'
  variant: 'solid' | 'outline'
  tone: 'dark' | 'light'
}

const baseClasses =
  'inline-flex min-h-12 items-center justify-center rounded-full font-medium uppercase tracking-[0.14em] transition duration-300 ease-out hover:-translate-y-px active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vinho focus-visible:ring-offset-2 focus-visible:ring-offset-marfim disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed'

const sizeClasses: Record<ActionButtonStyleOptions['size'], string> = {
  sm: 'px-5 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-sm',
}

const variantClasses: Record<
  ActionButtonStyleOptions['variant'],
  Record<ActionButtonStyleOptions['tone'], string>
> = {
  solid: {
    dark: 'bg-vinho text-marfim shadow-[inset_0_0_0_1px_rgba(243,236,226,.2)] hover:bg-vinho-hover',
    light:
      'bg-marfim text-[#1b1212] hover:bg-white focus-visible:ring-marfim focus-visible:ring-offset-tinta',
  },
  outline: {
    dark: 'border border-vinho/50 text-vinho hover:bg-vinho/10',
    light:
      'border border-marfim/60 text-marfim hover:bg-marfim/10 focus-visible:ring-marfim focus-visible:ring-offset-tinta',
  },
}

export function getActionButtonClasses({
  size,
  variant,
  tone,
}: ActionButtonStyleOptions): string {
  return cn(baseClasses, sizeClasses[size], variantClasses[variant][tone])
}
