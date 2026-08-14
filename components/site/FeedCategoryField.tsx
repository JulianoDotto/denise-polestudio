'use client'

import { useState } from 'react'
import { NEW_FEED_CATEGORY_VALUE } from '@/lib/admin/feed-category'

export default function FeedCategoryField({
  categories,
}: {
  categories: { id: string; title: string }[]
}) {
  const [category, setCategory] = useState(NEW_FEED_CATEGORY_VALUE)
  const [newCategoryName, setNewCategoryName] = useState('')
  const isNewCategory = category === NEW_FEED_CATEGORY_VALUE

  return (
    <div className="grid gap-3">
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">Categoria</span>
        <select
          name="storeSectionId"
          value={category}
          onChange={(event) => {
            const nextCategory = event.target.value
            setCategory(nextCategory)
            if (nextCategory !== NEW_FEED_CATEGORY_VALUE) setNewCategoryName('')
          }}
          className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900"
        >
          <option value={NEW_FEED_CATEGORY_VALUE}>Cadastrar nova categoria</option>
          <option value="">Sem categoria</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>{item.title}</option>
          ))}
        </select>
      </label>
      {isNewCategory ? (
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            Nome da nova categoria
          </span>
          <input
            name="newCategoryName"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            required
            autoComplete="off"
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900"
          />
        </label>
      ) : null}
    </div>
  )
}
