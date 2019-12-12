
import * as chalk from 'chalk'
import logger from './logger'

export class Parser {
  options: any
  $: any
  pointer: number
  tickesAvailable: Array<object> | null
  constructor(options: any, body: any) {
      this.options = options;
      this.$ = body;
      this.pointer = 0;

      this.tickesAvailable = null;
  }


  get isLocked() {
    return false;
    // return this.$('.g-recaptcha').index() >= 0
    //     && this.$('.g-recaptcha').attr('style') !== 'display: none';
}

get tickets() {
    return this.$('.listings-item:not(.listings-item--not-for-sale)');
}

get soldTickets() {
    return this.$('.listings-item.listings-item--not-for-sale');
}

get ticketsAvailable() {
    if (! this.tickesAvailable) {
        return this.tickesAvailable = this.getAvailableTickets();
    }

    return this.tickesAvailable;
}

get soldInfo() {
    return this.getSoldInfo();
}

popTicket() {
    if (this.pointer < this.ticketsAvailable.length) {
        return this.ticketsAvailable[this.pointer++];
    }
}

getSoldInfo() {
    let $ = this.$;
    var soldPrices = [];

    this.soldTickets.each(function() {
        var price = $(this).find('meta[itemprop="price"]').attr('content');
        price = parseInt(price, 10)

        soldPrices.push(price);
    });

    var soldTotal = soldPrices.reduce((a, b) => a + b, 0);
    var soldAverage = soldTotal / (soldPrices.length || 1);

    return {
        soldTotal,
        soldAverage,
    };
}

getAvailableTickets() :Array<object> {
    let $ = this.$;
    let self = this;
    let result = [];

    this.tickets.each(function(i, elem) {
        var price = $(this).find('meta[itemprop="price"]').attr('content')
        var link = $(this).find('.listings-item--title a').attr('href');
        price = parseInt(price, 10);

        if (! link) {
            logger.error([
                '',
                chalk.red('Expected to find link for listing'),
                '',
            ].join('\n'));
        } else {
            link = self.options.baseUrl + link;

            result.push({ link, price });
        }
    });

    result = result.sort((t1, t2) => t1.price - t2.price);

    if (result.length > 0) {
        const averagePrice = result.reduce((mem, x) => mem + x.price, 0) / result.length;
        logger.info([
            '',
            chalk.blue('Found Tickets For Event'),
            ` ${chalk.magenta('amount')}        : ${result.length}`,
            ` ${chalk.magenta('average price')} : ${averagePrice.toFixed(2)}`,
            ` ${chalk.magenta('lowest price')}  : ${result[0].price}`,
            '',
        ].join('\n'));
    }

    return result;
}

}