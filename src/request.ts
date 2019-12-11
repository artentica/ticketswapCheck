import * as rp from 'request-promise'
import * as tough  from 'tough-cookie'
import extractDomain from 'extract-domain';
import * as cheerio from 'cheerio';

import { logRequest } from './utils'
// import logger from './logger'

export default function request(url: string, opts: any ={}, cookies = []) {

  const jar = rp.jar();
  cookies.forEach((cookie: object) => {
    // Put cookie in an jar which can be used across multiple requests
    jar.setCookie(new tough.Cookie({
      ...cookie,
      domain: extractDomain(url),
      httpOnly: true,
      maxAge: 31536000
    }), url);
    jar.setCookie(cookie, url)
  })

  const options = Object.assign(opts, {
      uri: url,
      jar,
      headers: opts.headers || {},
      transform: function (body: any, response: any) {
          return {
            response,
            body: cheerio.load(body),
        }
      }
  })

  logRequest(url, options)

  return rp(options)
}