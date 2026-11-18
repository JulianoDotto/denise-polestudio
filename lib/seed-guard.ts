const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

export function assertLocalDatabase(connectionString: string): void {
  let url: URL
  let hostname: string
  try {
    url = new URL(connectionString)
    hostname = url.hostname
  } catch {
    throw new Error('Seed aborted: DATABASE_URL is not a valid URL.')
  }

  if (url.searchParams.has('host') || url.searchParams.has('hostaddr')) {
    throw new Error(
      'Seed aborted: DATABASE_URL must not override the host through query parameters.',
    )
  }

  if (!LOCAL_HOSTS.has(hostname)) {
    throw new Error(
      'Seed aborted: it wipes every table, so it only runs against a local database (localhost, 127.0.0.1 or [::1]).',
    )
  }
}
