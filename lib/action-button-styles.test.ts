import assert from 'node:assert/strict'
import test from 'node:test'

import { getActionButtonClasses } from './action-button-styles'

test('solid dark is the wine pill', () => {
  const classes = getActionButtonClasses({ size: 'md', variant: 'solid', tone: 'dark' })
  for (const name of ['rounded-full', 'bg-vinho', 'text-marfim', 'hover:bg-vinho-hover', 'min-h-12']) {
    assert.ok(classes.includes(name), name)
  }
})

test('solid light is the wine pill outlined for dark backgrounds', () => {
  const classes = getActionButtonClasses({ size: 'md', variant: 'solid', tone: 'light' })
  for (const name of ['bg-vinho', 'text-marfim', 'hover:bg-vinho-hover', 'focus-visible:ring-offset-tinta']) {
    assert.ok(classes.includes(name), name)
  }
  assert.ok(!classes.includes('bg-marfim'))
})

test('labels stay centered and tighten on small screens', () => {
  const classes = getActionButtonClasses({ size: 'lg', variant: 'solid', tone: 'light' })
  for (const name of ['text-center', 'tracking-[0.1em]', 'sm:tracking-[0.14em]']) {
    assert.ok(classes.includes(name), name)
  }
})

test('the click pulse stays inside the pill and behind the label', () => {
  const classes = getActionButtonClasses({ size: 'md', variant: 'outline', tone: 'dark' })
  for (const name of ['relative', 'isolate', 'overflow-hidden']) {
    assert.ok(classes.includes(name), name)
  }
})

test('outline keeps the pill shape', () => {
  const classes = getActionButtonClasses({ size: 'sm', variant: 'outline', tone: 'dark' })
  assert.ok(classes.includes('rounded-full'))
  assert.ok(classes.includes('border'))
})

test('disabled buttons are dimmed and not clickable-looking', () => {
  const classes = getActionButtonClasses({ size: 'md', variant: 'solid', tone: 'dark' })
  assert.ok(classes.includes('disabled:opacity-50'))
  assert.ok(classes.includes('disabled:pointer-events-none'))
  assert.ok(!classes.includes('disabled:cursor-not-allowed'))
})

test('motion is switched off for reduced-motion users', () => {
  const classes = getActionButtonClasses({ size: 'md', variant: 'solid', tone: 'dark' })
  for (const name of [
    'motion-reduce:transition-none',
    'motion-reduce:hover:translate-y-0',
    'motion-reduce:active:scale-100',
  ]) {
    assert.ok(classes.includes(name), name)
  }
})
