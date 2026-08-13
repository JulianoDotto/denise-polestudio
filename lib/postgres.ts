const SSL_MODES_WITH_LEGACY_VERIFY_FULL_SEMANTICS = new Set([
  'prefer',
  'require',
  'verify-ca',
])

/** Keeps pg 8's verified TLS behavior explicit and stable across pg major updates. */
export function getPostgresConnectionString(connectionString: string): string {
  let url: URL

  try {
    url = new URL(connectionString)
  } catch {
    throw new Error('Invalid PostgreSQL connection URL')
  }

  if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') {
    throw new Error('Invalid PostgreSQL connection URL')
  }

  const sslMode = url.searchParams.get('sslmode')

  if (sslMode && SSL_MODES_WITH_LEGACY_VERIFY_FULL_SEMANTICS.has(sslMode)) {
    url.searchParams.set('sslmode', 'verify-full')
  }

  return url.toString()
}
