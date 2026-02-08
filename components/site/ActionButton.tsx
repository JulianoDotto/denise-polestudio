import Link from 'next/link'

import { cn } from '@/lib/utils'

type ActionButtonBaseProps = {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline'
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
  md: 'px-5 py-2 text-sm',
  lg: 'px-6 py-3 text-sm',
}

const variantClasses = {
  solid: 'bg-[#0E0E0E] text-white hover:bg-black',
  outline: 'border border-zinc-300 text-zinc-700 hover:bg-zinc-100',
}

export default function ActionButton(
  props: ActionButtonLinkProps | ActionButtonButtonProps,
) {
  const {
    children,
    className,
    size = 'md',
    variant = 'solid',
  } = props

  const classes = cn(
    'inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30',
    sizeClasses[size],
    variantClasses[variant],
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
