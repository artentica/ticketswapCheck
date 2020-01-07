import * as chalk from 'chalk'
import * as notifier from 'node-notifier'
import * as opn from 'opn'

import config from './config'
import logger from './logger'
import request from './request'
import Parser from './parser'
import { NoTicketsFoundError, DepletedTicketsError } from './error'
import { runFound } from './foundTickets'

class Main {
  private lastDateRequest: number
  private amountReserved: number

  constructor() {
    this.lastDateRequest = Date.now()
    this.amountReserved = 0
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

  private buyIfFound = (options, { found, parser }) => {
    const ticket = parser.popTicket()
    if (found && ticket) {
      return runFound(ticket.link, { ...options, amount: options.amount - this.amountReserved }).then(result => {
        // if an amount have been bought we subtract of the total desire
        if (result.amountOfTickets) this.amountReserved += result.amountOfTickets
        // if nothing have been bought or if we still have
        if (options.amount - this.amountReserved !== 0) {
          return this.tryNextTicket(options, parser)
        }else {
          this.notifyIfTicketReserved(options)
        }

        // return result;
      })
    } else {
      return Promise.reject(new NoTicketsFoundError('Found no tickets to buy'))
    }
  }

  private tryNextTicket = (options, parser) => {
    if (parser.haveAnotherTicket()) {
      logger.info('Found another potential ticket')

      return this.buyIfFound(options, { found: true, parser })
    } else {
      logger.info('Depleted all available tickets.')
      logger.info('Restarting monitor.')
      return Promise.reject(new DepletedTicketsError('None of the tickets is available'))
    }
  }

  private notifyIfTicketReserved = (options) => {
    if(this.amountReserved){
      notifier.notify(
        {
          title: `TicketSwap ${this.amountReserved} ticket(s) reserved`,
          message: 'Click to open browser',
          sound: 'ding.mp3',
          wait: true
        },
        function() {
          opn(options.baseUrl + '/cart')
        }
      )
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
    .catch(runCatchHandler.bind(null, options))
  }
}

export default new Main()
