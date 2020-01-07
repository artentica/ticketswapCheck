export interface IOptions {
  cookie: Array<{ key: string, value: string }>
  retryPolicy: { delay: Array<number, 2>, retries: number }
  url: string
  baseUrl: string
  amount: number
}
