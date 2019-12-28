const DEFAULT_TIMEOUT = 5000 // 5 seconds

export const cancellableTimeoutableFetch = (
  path: string,
  abortController: AbortController,
  params?: RequestInit & { timeout?: number }
): Promise<Response> => {
  const timeoutPromise = new Promise<void>((_, reject) => {
    setTimeout(() => {
      abortController.abort()
      reject()
    }, (params && params.timeout) || DEFAULT_TIMEOUT)
  })
  return Promise.race([
    fetch(path, {
      ...params,
      signal: abortController.signal
    }),
    timeoutPromise
  ]) as Promise<Response>
}

export const cancellableTimeoutableFetchWithCredentials = (
  path: string,
  abortController: AbortController,
  params?: RequestInit & { timeout?: number }
): Promise<Response> => {
  return cancellableTimeoutableFetch(path, abortController, {
    credentials: 'include' as RequestCredentials,
    ...params
  })
}
