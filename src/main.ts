import * as chalk from 'chalk'

import config from './config'
import logger from './logger'
import request from './request'
import Parser from './parser'
import {NoTicketsFoundError} from './error'
import { runFound } from './foundTickets'

class Main {
  private lastDateRequest: number

  constructor() {
    this.lastDateRequest = Date.now()
  }

  public checkIfTicketsAvailable = parser => {
    if (parser.ticketsAvailable.length === 0) {
      logger.info(chalk.blue('No tickets found!'), Date.now() - this.lastDateRequest, 'ms')
      this.lastDateRequest = Date.now()
      return {
        found: false,
        parser
      }
    } else {
      return {
        found: true,
        parser
      }
    }
  }

  public buyIfFound = (options, { found, parser }) => {
    const ticket = parser.popTicket()
    if (found && ticket) {
      return runFound(ticket.link, options).then(_result => {
        //console.log(result)
        // if (result && result.alreadySold) {
        //     return tryNextTicket(options, parser);
        // }

        // return result;
      })
    } else {
      return Promise.reject(new NoTicketsFoundError('Found no tickets to buy'))
    }
  }

  public run = (options: any): any => {
    return Promise.resolve()
      .then(() => {
        return request(options.url)
      })
      .then(res => new Parser(config, res.body))
      .then(this.checkIfTicketsAvailable)
      .then(this.buyIfFound.bind(null, options))
    // .catch(runCatchHandler.bind(null, options));
  }
}

export default new Main()
