import * as chalk from 'chalk'
import logger from './logger'

export default class Parser {
  public options: any
  public $: any
  public pointer: number
  public tickesAvailable: object[] | null

  constructor(options: any, body: any) {
    this.options = options
    this.$ = body
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
    return this.$('#tickets > div:first > ul > div > a')
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
        link = self.options.baseUrl + link
        result.push({ link, ...priceAndCurrency, numberTicket })
      }
    })
    return result
    // this.tickets.each(function(i, elem) {
    //   let price = $(this)
    //     .find('meta[itemprop="price"]')
    //     .attr('content')
    //   let link = $(this)
    //     .find('.listings-item--title a')
    //     .attr('href')
    //   price = parseInt(price, 10)

    //   if (!link) {
    //     logger.error(['', chalk.red('Expected to find link for listing'), ''].join('\n'))
    //   } else {
    //     link = self.options.baseUrl + link

    //     result.push({ link, price })
    //   }
    // })

    // result = result.sort((t1, t2) => t1.price - t2.price)

    // if (result.length > 0) {
    //   const averagePrice = result.reduce((mem, x) => mem + x.price, 0) / result.length
    //   logger.info(
    //     [
    //       '',
    //       chalk.blue('Found Tickets For Event'),
    //       ` ${chalk.magenta('amount')}        : ${result.length}`,
    //       ` ${chalk.magenta('average price')} : ${averagePrice.toFixed(2)}`,
    //       ` ${chalk.magenta('lowest price')}  : ${result[0].price}`,
    //       ''
    //     ].join('\n')
    //   )
    // }

    // return result
  }

  // get tickets() {
  //   return this.$('.listings-item:not(.listings-item--not-for-sale)')
  // }

  // get soldTickets() {
  //   return this.$('.listings-item.listings-item--not-for-sale')
  // }

  // get soldInfo() {
  //   return this.getSoldInfo()
  // }

  // public popTicket() {
  //   if (this.pointer < this.ticketsAvailable.length) {
  //     return this.ticketsAvailable[this.pointer++]
  //   }
  // }

  // public getSoldInfo() {
  //   const $ = this.$
  //   const soldPrices = []

  //   this.soldTickets.each(function() {
  //     let price = $(this)
  //       .find('meta[itemprop="price"]')
  //       .attr('content')
  //     price = parseInt(price, 10)

  //     soldPrices.push(price)
  //   })

  //   const soldTotal = soldPrices.reduce((a, b) => a + b, 0)
  //   const soldAverage = soldTotal / (soldPrices.length || 1)

  //   return {
  //     soldTotal,
  //     soldAverage
  //   }
  // }
}
