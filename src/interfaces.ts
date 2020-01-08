export interface IOptions {
  cookie: Array<{ key: string, value: string }>
  retryPolicy: { delay: [number, number], retries: number }
  url: string
  amount: number
}
