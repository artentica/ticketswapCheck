import * as cheerio from 'cheerio'
import * as cheerioAdv from 'cheerio-advanced-selectors'
import * as extractDomain from 'extract-domain'
import * as rp from 'request-promise'
import * as tough from 'tough-cookie'

import config from './config'
import { logRequest } from './utils'
// import logger from './logger'

export default function request(url: string, opts: any = {}, cookies = []): Promise<any> {
  const jar = rp.jar()
  const cheerioExtended = cheerioAdv.wrap(cheerio)
  ;[...cookies, ...config.cookie]
    .map(
      (cookie: object) =>
        new tough.Cookie({
          ...cookie,
          domain: extractDomain(url),
          httpOnly: true,
          maxAge: 31536000
        })
    )
    .forEach(cookie => jar.setCookie(cookie.toString(), url))

  const options = Object.assign(
    {
      uri: url,
      jar,
      method: 'GET',
      headers: opts.headers || {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'
      },
      transform(body: any, response: any) {
        return {
          response,
          body: cheerioExtended.load(body)
        }
      }
    },
    opts
  )

  logRequest(url, options)

  return rp(options)
}
