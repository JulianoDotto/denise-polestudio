import Link from 'next/link'

import { cn } from '@/lib/utils'
import { getActionButtonClasses } from '@/lib/action-button-styles'

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

  const classes = cn(getActionButtonClasses({ size, variant, tone }), className)

  const isLink = (
    value: ActionButtonLinkProps | ActionButtonButtonProps,
  ): value is ActionButtonLinkProps => typeof (value as ActionButtonLinkProps).href === 'string'

  if (isLink(props)) {
    const { href, target, rel } = props
    const isExternal = /^https?:\/\//i.test(href)

    if (isExternal) {
      return (
        <a href={href} target={target} rel={rel} className={classes}>
          {children}
        </a>
      )
    }

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
