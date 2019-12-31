import * as chalk from 'chalk'
import * as cheerio from 'cheerio'
import { exec } from 'child_process'
import * as notifier from 'node-notifier'

import logger from './logger'
import request from './request'
// const utils = require('./utils');

export function reserve({ form, csrf, availableTickets, _endpoint }, link, options) {}

export async function runFound(link, options): Promise<object> {
  // STEP 1 submit form
  // STEP 2 request /cart

  return request(link).then(parseHTML)
  // .then(result => process(result, link, options))
  // .then((result) => {
  //     if (result.alreadySold) {
  //         return result;
  //     }

  //     notifier.notify({
  //         title: 'TicketScoop!',
  //         message: 'Found a ticket, now opening your cart!',
  //         sound: true,
  //     });

  //     exec('open -a "Google Chrome" https://www.ticketswap.nl/cart');

  //     return {
  //         alreadySold: false,
  //     };
  // });
}

export function parseHTML($: any): any {
  // var form = $('#listing-reserve-form');
  // var _endpoint = form.data('endpoint');
  // var csrf = $('meta[name="csrf_token"]')[0].attribs.content;
  // let availableTickets = 0;
  // form.find('select[name="amount"] option').each(function(_i, elem) {
  //     let value = $(elem).attr('value');
  //     value = parseInt(value, 10);
  //     if (isNaN(value)) {
  //         throw new TypeError('Expected option.value to be of type number');
  //     }
  //     if (value > availableTickets) {
  //         availableTickets = value;
  //     }
  // });
  // return {
  //     form,
  //     _endpoint,
  //     availableTickets,
  //     csrf,
  // };
}
