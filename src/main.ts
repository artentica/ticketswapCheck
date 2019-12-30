import * as chalk from 'chalk'

// import config from './config'
import logger from './logger'
import request from './request'
// import { runFound } from './foundTickets'

class Main {
  private lastDateRequest: number

  constructor() {
    this.lastDateRequest = Date.now()
  }


  public checkIfTicketsAvailable = parser => {
    if (parser.ticketsAvailable.length === 0) {
      logger.info(chalk.blue('No tickets found!'), Date.now() - this.lastDateRequest, 'ms');
      this.lastDateRequest = Date.now();

      return {
        found: false,
        parser,
      }
    } else {
      return {
        found: true,
        parser,
      }
    }
  }


  // buyIfFound = (options, { found, parser }) =>{
  //   let ticket = parser.popTicket();

  //   if (found && ticket) {
  //       return runFound(ticket.link, options)
  //           .then(result => {
  //               if (result && result.alreadySold) {
  //                   return tryNextTicket(options, parser);
  //               }

  //               return result;
  //           });
  //   } else {
  //       return Promise.reject(new errors.NoTicketsFoundError('Found no tickets to buy'));
  //   }
  // }

  public run = (options: any) => {
    return Promise.resolve()
      .then(() => {
        return request(options.url);
      })
  }
}

export default new Main()