import * as cheerio from 'cheerio';
import * as extractDomain from 'extract-domain';
import * as rp from 'request-promise'
import * as tough  from 'tough-cookie'

import config from './config'
import { logRequest } from './utils'
// import logger from './logger'

export default function request(url: string, opts: any ={}, cookies = []) {
  const jar = rp.jar();
  [...cookies,...config.cookie].forEach((cookie: object) => {
    console.log(extractDomain(url))
    // Put cookie in an jar which can be used across multiple requests
    jar.setCookie(JSON.stringify(new tough.Cookie({
      ...cookie,
      domain: extractDomain(url),
      httpOnly: true,
      maxAge: 31536000
    })), url)
  })
  console.log(JSON.stringify(jar))
  const options = Object.assign(opts, {
      uri: url,
      jar,
      method: 'GET',
      headers: opts.headers || {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'},
      transform (body: any, response: any) {
          return {
            response,
            body: cheerio.load(body),
        }
      }
  })

  logRequest(url, options)

  return rp(options)
}