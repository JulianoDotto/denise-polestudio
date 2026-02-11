import Link from 'next/link'

import { cn } from '@/lib/utils'

type ActionButtonBaseProps = {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline'
  tone?: 'dark' | 'light'
}

type ActionButtonLinkProps = ActionButtonBaseProps & {
  href: string
  target?: string
  rel?: string
}

type ActionButtonButtonProps = ActionButtonBaseProps & {
  href?: undefined
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2 text-base',
  lg: 'px-6 py-3 text-base',
}

const variantClasses = {
  solid: {
    dark: 'bg-[#0E0E0E] text-zinc-300 hover:bg-stone-950',
    light: 'bg-white text-zinc-900 hover:bg-zinc-100',
  },
  outline: {
    dark: 'border border-zinc-300 text-zinc-700 hover:bg-zinc-100',
    light: 'border border-white/60 text-zinc-300 hover:bg-white/10',
  },
}

export default function ActionButton(
  props: ActionButtonLinkProps | ActionButtonButtonProps,
) {
  const {
    children,
    className,
    size = 'md',
    variant = 'solid',
    tone = 'dark',
  } = props

  const classes = cn(
    'inline-flex items-center justify-center rounded-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30',
    sizeClasses[size],
    variantClasses[variant][tone],
    className,
  )

  const isLink = (
    value: ActionButtonLinkProps | ActionButtonButtonProps,
  ): value is ActionButtonLinkProps => typeof (value as ActionButtonLinkProps).href === 'string'

  if (isLink(props)) {
    const { href, target, rel } = props
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    )
  }

  const { type = 'button', onClick, disabled } = props
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
