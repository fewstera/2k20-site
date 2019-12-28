const DEFAULT_TIMEOUT = 5000 // 5 seconds

export const timeoutableFetch = (path: string, params?: RequestInit & { timeout?: number }): Promise<Response> => {
  const abortController = new AbortController()
  const signal = abortController.signal

  const timeoutPromise = new Promise<void>((_, reject) => {
    setTimeout(() => {
      abortController.abort()
      reject()
    }, (params && params.timeout) || DEFAULT_TIMEOUT)
  })

  return Promise.race([
    fetch(path, {
      ...params,
      signal
    }),
    timeoutPromise
  ]) as Promise<Response>
}

export const timeoutableFetchWithCredentials = (
  path: string,
  params?: RequestInit & { timeout?: number }
): Promise<Response> => {
  return timeoutableFetch(path, { credentials: 'include' as RequestCredentials, ...params })
}
