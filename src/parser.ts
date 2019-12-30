import * as chalk from 'chalk';
import logger from './logger';

export class Parser {
  public options: any;
  public $: any;
  public pointer: number;
  public tickesAvailable: object[] | null;

  constructor(options: any, body: any) {
    this.options = options;
    this.$ = body;
    this.pointer = 0;

    this.tickesAvailable = null;
  }

  get tickets() {
    return this.$('.listings-item:not(.listings-item--not-for-sale)');
  }

  get soldTickets() {
    return this.$('.listings-item.listings-item--not-for-sale');
  }

  get ticketsAvailable() {
    if (!this.tickesAvailable) {
      return (this.tickesAvailable = this.getAvailableTickets());
    }

    return this.tickesAvailable;
  }

  get soldInfo() {
    return this.getSoldInfo();
  }

  public popTicket() {
    if (this.pointer < this.ticketsAvailable.length) {
      return this.ticketsAvailable[this.pointer++];
    }
  }

  public getSoldInfo() {
    const $ = this.$;
    const soldPrices = [];

    this.soldTickets.each(function() {
      let price = $(this)
        .find('meta[itemprop="price"]')
        .attr('content');
      price = parseInt(price, 10);

      soldPrices.push(price);
    });

    const soldTotal = soldPrices.reduce((a, b) => a + b, 0);
    const soldAverage = soldTotal / (soldPrices.length || 1);

    return {
      soldTotal,
      soldAverage
    };
  }

  public getAvailableTickets(): object[] {
    const $ = this.$;
    const self = this;
    let result = [];

    this.tickets.each(function(i, elem) {
      let price = $(this)
        .find('meta[itemprop="price"]')
        .attr('content');
      let link = $(this)
        .find('.listings-item--title a')
        .attr('href');
      price = parseInt(price, 10);

      if (!link) {
        logger.error(['', chalk.red('Expected to find link for listing'), ''].join('\n'));
      } else {
        link = self.options.baseUrl + link;

        result.push({ link, price });
      }
    });

    result = result.sort((t1, t2) => t1.price - t2.price);

    if (result.length > 0) {
      const averagePrice = result.reduce((mem, x) => mem + x.price, 0) / result.length;
      logger.info(
        [
          '',
          chalk.blue('Found Tickets For Event'),
          ` ${chalk.magenta('amount')}        : ${result.length}`,
          ` ${chalk.magenta('average price')} : ${averagePrice.toFixed(2)}`,
          ` ${chalk.magenta('lowest price')}  : ${result[0].price}`,
          ''
        ].join('\n')
      );
    }

    return result;
  }
}
