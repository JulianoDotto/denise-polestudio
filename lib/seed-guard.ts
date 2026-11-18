const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

export function assertLocalDatabase(connectionString: string): void {
  let hostname: string
  try {
    hostname = new URL(connectionString).hostname
  } catch {
    throw new Error('Seed aborted: DATABASE_URL is not a valid URL.')
  }

  if (!LOCAL_HOSTS.has(hostname)) {
    throw new Error(
      'Seed aborted: it wipes every table, so it only runs against a local database (localhost, 127.0.0.1 or [::1]).',
    )
  }
}
