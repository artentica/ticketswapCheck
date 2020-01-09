import * as chalk from 'chalk'
import * as fs from 'fs'
import logger from './logger'

/**
 * Get a randomized time between boundaries
 *
 * @param {number} minTime - Min time
 * @param {number} maxTime - Max time
 * @returns {number} - Time to wait between each function call
 */
function randomTime(minTime: number, maxTime: number) {
  return Math.random() * (maxTime - minTime) + minTime
}

/**
 * Delay the call of a function between min and max time (in sec)
 *
 * @param {Function} fn - Function to call
 * @param {number[]} [minTime, maxTime]  - minTime and upper time
 * @returns {Promise} - The Promise of the call function
 */
export function delay(fn: Function, [minTime, maxTime]: number[]): Promise<any> {
  const time = randomTime(minTime, maxTime)

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(fn())
    }, time)
  })
}

export function getBaseUrl(url: string): string {
  return url
    .split('/')
    .slice(0, 3)
    .join('/')
}

/**
 *
 *
 * @export
 * @param {object} reason
 * @
 */
export function logErrors(reason: any) {
  if (!reason.statusCode) {
    logger.error('Error in code')
    logger.error(reason)
  } else {
    logger.error('Request failed')
    logger.error(`Error reason, statusCode: ${reason.statusCode}`)

    fs.writeFileSync('./error.log', JSON.stringify(reason))

    logger.info('Wrote response in error.log')
  }
}

export function logRequest(url: string, options: any = { method: 'GET' }) {
  logger.debug('%s %s', chalk.inverse(options.method), url)
}
