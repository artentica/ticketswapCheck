import * as chalk from 'chalk'
import logger from './logger'
import * as utils from './utils'

export default class Parser {
  public options: any
  public $: any
  public pointer: number
  public tickesAvailable: object[] | null

  constructor(options: any, body: any) {
    this.options = options
    this.$ = body
    //next index to use
    this.pointer = 0

    this.tickesAvailable = null
  }

  get ticketsAvailable() {
    if (!this.tickesAvailable) {
      return (this.tickesAvailable = this.getAvailableTickets())
    }

    return this.tickesAvailable
  }

  get tickets() {
    // Available, sold, buy from another fan,searching people
    return this.$('#tickets > div').length > 2 ? this.$('#tickets > div:first > ul > div > a') : []
  }

  private getPriceAndCurrency(str: string): { price: number; currency: string } {
    const string = str.trim()
    return {
      price: parseFloat((string.match(/\d*(,|\.)\d*/g) || [])[0].replace(',', '.')),
      currency: (str.match(/[^\d|,|\.]/g) || [])[0] || ''
    }
  }

  public getAvailableTickets(): object[] {
    const self = this
    const $ = this.$
    let result: { link: string; price: number; currency: string; numberTicket: number }[] = []

    if (this.tickets.length) {
      this.tickets.each(function(_i, elem): void {
        const priceAndCurrency = self.getPriceAndCurrency(
          $(elem)
            .find('footer')
            .children()
            .last()
            .text()
            .split('/')[0]
        )

        const numberTicket = parseInt(
          $(elem)
            .find('div > header > h3')
            .text()
            .trim()
            .match(/\d*/g)[0]
        )

        let link = $(elem).attr('href')
        if (!link) {
          logger.error(['', chalk.red('Expected to find link for listing'), ''].join('\n'))
        } else {
          link = utils.getBaseUrl(self.options.url) + link
          result.push({ link, ...priceAndCurrency, numberTicket })
        }
      })
    }

    result = result.sort((t1, t2) => t1.price - t2.price)

    if (result.length > 0) {
      const sumInfo = result.reduce(
        (acc, curr) => ({
          averagePrice: acc.averagePrice + curr.price * curr.numberTicket,
          numberTicket: acc.numberTicket + curr.numberTicket
        }),
        { averagePrice: 0, numberTicket: 0 }
      )

      logger.info(
        [
          '',
          chalk.blue('Found Tickets For Event'),
          ` ${chalk.magenta('amount')}        : ${sumInfo.numberTicket}`,
          ` ${chalk.magenta('average price')} : ${(sumInfo.averagePrice / sumInfo.numberTicket).toFixed(2)} ${
            result[0].currency
          }`,
          ` ${chalk.magenta('lowest price')}  : ${result[0].price} ${result[0].currency}`,
          ''
        ].join('\n')
      )
    }

    return result
  }

  public popTicket() {
    if (this.pointer < this.ticketsAvailable.length) {
      return this.ticketsAvailable[this.pointer++]
    }
  }

  public haveAnotherTicket() {
    return this.pointer < this.ticketsAvailable.length
  }
}
