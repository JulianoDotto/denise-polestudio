import assert from 'node:assert/strict'
import test from 'node:test'

import { TEXTS } from '../hardcoded/texts'
import { CONTENT_FORMS } from './admin/content-forms'

test('each content type keeps its current fields', () => {
  assert.deepEqual(CONTENT_FORMS.class.fields, ['title', 'description', 'cover'])
  assert.deepEqual(CONTENT_FORMS.event.fields, ['title', 'description', 'eventDate'])
  assert.deepEqual(CONTENT_FORMS.workshop.fields, ['title', 'description'])
  assert.deepEqual(CONTENT_FORMS.digitalProduct.fields, ['title', 'description', 'link', 'digitalType'])
})

test('every create, edit and delete shows a pending label ending in an ellipsis', () => {
  for (const config of Object.values(CONTENT_FORMS)) {
    for (const pending of [config.create.pending, config.edit.pending, config.delete.pending]) {
      assert.match(pending, /…$/)
    }
  }
})

test('each content type keeps its current messages', () => {
  assert.equal(CONTENT_FORMS.class.errors.imageSize, TEXTS.AULAS_ADMIN_ERROR_IMAGE_SIZE_1)
  assert.equal(CONTENT_FORMS.workshop.errors.update, TEXTS.WORKSHOPS_EDIT_ERROR_UPDATE_1)
  assert.equal(CONTENT_FORMS.digitalProduct.errors.type, TEXTS.PRODUTOS_DIGITAIS_ADMIN_ERROR_TYPE_1)
  assert.equal(CONTENT_FORMS.event.delete.confirm, TEXTS.EVENTOS_DELETE_CONFIRM_1)
})
