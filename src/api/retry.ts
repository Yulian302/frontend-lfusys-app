import { isAxiosError } from "axios"

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function retry<T>(
  fn: () => Promise<T>,
  { maxAttempts = 3, delayMs = 300 }: { maxAttempts?: number; delayMs?: number }
) {
  let attempt = 0
  let lastErr: unknown

  while (++attempt <= maxAttempts) {
    try {
      return await fn()
    } catch (err: unknown) {
      lastErr = err

      if (isAxiosError(err)) {
        const status = err.response?.status

        if (status && status >= 400 && status < 500 && status != 429) throw err
      }
      if (attempt >= maxAttempts) break
      const jitter = Math.random() * 100
      const backoff = delayMs * Math.pow(2, attempt - 1) + jitter
      await wait(backoff)
    }
  }
  throw lastErr
}
