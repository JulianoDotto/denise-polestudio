import { writeFileSync } from 'node:fs'
import { Client } from 'pg'

import { getPostgresConnectionString } from '../lib/postgres'
import { diffRecoverableItems, type RecoverableItem } from '../lib/recovery-diff'

const QUERY = `SELECT "id", "type"::text AS "type", "title", "hotmartUrl", "whatsappTextTemplate",
  "scheduleOnlineUrl", "schedulePresentialUrl" FROM "Item" WHERE "type" IN ('CLASS','EVENT')`

async function readItems(url: string): Promise<RecoverableItem[]> {
  const client = new Client({ connectionString: getPostgresConnectionString(url) })
  await client.connect()
  try {
    const result = await client.query<RecoverableItem>(QUERY)
    return result.rows
  } finally {
    await client.end()
  }
}

async function main() {
  const outputPath = process.argv[2]
  const sourceUrl = process.env.RECOVERY_SOURCE_URL
  const productionUrl = process.env.PRODUCTION_READ_URL

  if (!outputPath) {
    console.error('Usage: tsx scripts/recovery-compare.ts <output.json> (outside the repository)')
    process.exit(1)
  }
  if (!sourceUrl || !productionUrl) {
    console.error('Missing RECOVERY_SOURCE_URL or PRODUCTION_READ_URL in the environment.')
    process.exit(1)
  }

  const [backup, current] = await Promise.all([readItems(sourceUrl), readItems(productionUrl)])
  const changes = diffRecoverableItems(backup, current)
  writeFileSync(outputPath, JSON.stringify(changes, null, 2))
  console.log(`${changes.length} recoverable value(s) written to ${outputPath}`)
}

main().catch((error: unknown) => {
  console.error('Recovery comparison failed:', error instanceof Error ? error.message : 'unknown error')
  process.exit(1)
})
