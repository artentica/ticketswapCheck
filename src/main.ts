import * as chalk from 'chalk'
import * as notifier from 'node-notifier'
import * as opn from 'opn'

import config from './config'
import logger from './logger'
import request from './request'
import Parser from './parser'
import * as utils from './utils'
import { IOptions } from './interfaces'
import { NoTicketsFoundError, DepletedTicketsError, NotSignedError } from './error'
import { runFound } from './foundTickets'

class Main {
  private lastDateRequest: number
  private amountReserved: number
  private retries: number

  constructor() {
    this.lastDateRequest = Date.now()
    this.amountReserved = 0
    this.retries = 0
  }

  private checkIfTicketsAvailable = parser => {
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

  private buyIfFound = (options: IOptions, { found, parser }) : Promise<any> => {
    const ticket = parser.popTicket()
    if (found && ticket) {
      return runFound(ticket.link, { ...options, amount: options.amount - this.amountReserved }).then(result => {
        // if an amount have been bought we subtract of the total desire
        if (result.amountOfTickets) this.amountReserved += result.amountOfTickets
        // if nothing have been bought or if we still have
        if (options.amount - this.amountReserved !== 0) {
          return this.tryNextTicket(options, parser)
        } else {
          this.notifyIfTicketReserved(options)
        }
      })
    } else {
      return Promise.reject(new NoTicketsFoundError('Found no tickets to buy'))
    }
  }

  private tryNextTicket = (options: IOptions, parser) : Promise<any> => {
    if (parser.haveAnotherTicket()) {
      logger.info('Found another potential ticket')

      return this.buyIfFound(options, { found: true, parser })
    } else {
      logger.info('Depleted all available tickets.')
      logger.info('Restarting monitor.')
      return Promise.reject(new DepletedTicketsError('None of the tickets is available'))
    }
  }

  private notifyIfTicketReserved = options => {
    logger.info(chalk.blue('Tickets found!'), Date.now() - this.lastDateRequest, 'ms')
    this.lastDateRequest = Date.now()
    if (this.amountReserved) {
      notifier.notify(
        {
          title: `TicketSwap ${this.amountReserved} ticket(s) reserved`,
          message: 'Click to open browser',
          sound: 'ding.mp3',
          wait: true
        },
        function() {
          opn(utils.getBaseUrl(options.url) + '/cart')
        }
      )
    }
  }

  private runCatchHandler = (options: IOptions, error: Error) => {
    if (error instanceof NoTicketsFoundError) {
      return this.retry(options)
    }

    if (error instanceof DepletedTicketsError) {
      return this.retry(options)
    }

    if (error instanceof NotSignedError) {
      return Promise.reject(error)
    }


    if (options.retryPolicy.retries === -1) {
      this.retries += 1
      return this.retry(options)
    }
    if (this.retries < options.retryPolicy.retries) {
      this.retries += 1
      logger.info('Retries left', options.retryPolicy.retries - this.retries)
      return this.retry(options)
    }

    //logger.error('Run execution failed with error', error)
    return Promise.reject(error)
  }

  private retry = (options: IOptions) : Promise<any> => {
    return utils.delay(
      () => {
        return this.run(options)
      },
      options.retryPolicy.delay
    )
  }

  public run = (options: IOptions): any => {
    return Promise.resolve()
      .then(() => {
        return request(options.url)
      })
      .then(res => new Parser(config, res.body))
      .then(this.checkIfTicketsAvailable)
      .then(this.buyIfFound.bind(null, options))
      .catch(this.runCatchHandler.bind(null, options))
  }
}

export default new Main()
