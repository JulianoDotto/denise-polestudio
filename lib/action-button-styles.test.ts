import assert from 'node:assert/strict'
import test from 'node:test'

import { getActionButtonClasses } from './action-button-styles'

test('solid dark is the wine pill', () => {
  const classes = getActionButtonClasses({ size: 'md', variant: 'solid', tone: 'dark' })
  for (const name of ['rounded-full', 'bg-vinho', 'text-marfim', 'hover:bg-vinho-hover', 'min-h-12']) {
    assert.ok(classes.includes(name), name)
  }
})

test('solid light is the ivory pill for dark backgrounds', () => {
  const classes = getActionButtonClasses({ size: 'md', variant: 'solid', tone: 'light' })
  assert.ok(classes.includes('bg-marfim'))
  assert.ok(classes.includes('text-[#1b1212]'))
  assert.ok(!classes.includes('bg-vinho'))
})

test('outline keeps the pill shape', () => {
  const classes = getActionButtonClasses({ size: 'sm', variant: 'outline', tone: 'dark' })
  assert.ok(classes.includes('rounded-full'))
  assert.ok(classes.includes('border'))
})

test('disabled buttons are dimmed and not clickable-looking', () => {
  const classes = getActionButtonClasses({ size: 'md', variant: 'solid', tone: 'dark' })
  assert.ok(classes.includes('disabled:opacity-50'))
  assert.ok(classes.includes('disabled:cursor-not-allowed'))
})
