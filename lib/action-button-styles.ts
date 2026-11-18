import { cn } from './utils'

export type ActionButtonStyleOptions = {
  size: 'sm' | 'md' | 'lg'
  variant: 'solid' | 'outline'
  tone: 'dark' | 'light'
}

const baseClasses =
  'inline-flex min-h-12 items-center justify-center rounded-full font-medium uppercase tracking-[0.14em] transition duration-300 ease-out hover:-translate-y-px active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vinho focus-visible:ring-offset-2 focus-visible:ring-offset-marfim disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100'

const sizeClasses: Record<ActionButtonStyleOptions['size'], string> = {
  sm: 'px-5 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-sm',
}

const variantClasses: {
  solid: Record<ActionButtonStyleOptions['tone'], string>
  outline: string
} = {
  solid: {
    dark: 'bg-vinho text-marfim shadow-[inset_0_0_0_1px_rgba(243,236,226,.2)] hover:bg-vinho-hover',
    light:
      'bg-marfim text-[#1b1212] hover:bg-white focus-visible:ring-marfim focus-visible:ring-offset-tinta',
  },
  outline: 'border border-vinho/50 text-vinho hover:bg-vinho/10',
}

export function getActionButtonClasses({
  size,
  variant,
  tone,
}: ActionButtonStyleOptions): string {
  const variantClass =
    variant === 'outline' ? variantClasses.outline : variantClasses.solid[tone]
  return cn(baseClasses, sizeClasses[size], variantClass)
}
