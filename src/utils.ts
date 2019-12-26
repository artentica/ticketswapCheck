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
  return Math.random() * (maxTime - minTime) + minTime;
}

/**
 * Delay the call of a function between min and max time (in sec)
 *
 * @param {Function} fn - Function to call
 * @param {number[]} [minTime, maxTime]  - minTime and upper time
 * @returns {Promise} - The Promise of the call function
 */
export function delay(fn: Function, [minTime, maxTime]: number[]) {
  const time = randomTime(minTime, maxTime);

  return new Promise(resolve => {
      setTimeout(() => {
          resolve(fn());
      }, time);
  });
}

/**
 *
 *
 * @export
 * @param {object} reason
 * @
 */
export function logErrors(reason: any) {
  if (reason instanceof Error) {
      logger.error('Error in code')
      logger.error(reason);
  }else {
    logger.error('Request failed')
    logger.error('Error reason', reason.error);

    fs.writeFileSync('./error.log', JSON.stringify(reason));

    logger.info('Wrote response in error.log');
  }
}

export function logRequest(url: string, options: any = {method: 'GET'}) {
  console.log(options.method)
    logger.info('%s %s', chalk.inverse(options.method), url);
}