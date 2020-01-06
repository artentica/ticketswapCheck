import * as chalk from 'chalk'
// import * as cheerio from 'cheerio'
// import { exec } from 'child_process'
// import * as notifier from 'node-notifier'

import logger from './logger'
import request from './request'
import * as utils from './utils'
// const utils = require('./utils');

// export function reserve({ form, csrf, availableTickets, _endpoint }, link, options) {}

export async function runFound(link, options): Promise<object> {
  // STEP 1 submit form
  // STEP 2 request /cart

  return request(link).then(parseHTML).then(({listingId, listingHash, availableTickets}) => process(listingId, listingHash, availableTickets, options)).catch(_=>{})
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

export async function process(listingId :string, listingHash: string, availableTickets: number, options: any): Promise<any> {

  const amountOfTickets = Math.min(options.amount, availableTickets)
  const body = [
    {
       operationName:"addTicketsToCart",
       variables:{
          input:{
             listingId,
             listingHash,
             amountOfTickets
          }
       },
       query:`mutation addTicketsToCart($input: AddTicketsToCartInput!) {
        addTicketsToCart(input: $input) {
          cart {
            id
            __typename
          }
          errors {
            code
            message
            __typename
          }
          __typename
        }
      }
      `
    }
  ]

    logger.info([
      ``,
      `${chalk.green('Reserving ticket')}:`,
      //` ${chalk.magenta('token')}           : ${token}`,
      // ` ${chalk.magenta('reserve[_token]')} : ${reserveToken}`,
      // ` ${chalk.magenta('csrf_token')}      : ${csrf}`,
      ` ${chalk.magenta('amount')}          : ${amountOfTickets}`,
      ``,
  ].join('\n'));

  return await request("https://api.ticketswap.com/graphql/public/batch", {method: 'POST', json: true, body, headers:{authorization: `Bearer ZmFhNWVhZjBiOGU4NmNhMjcwZTBkYTRlOTc0NGU1MGFiY2ViZWM0ZDgzODhmYzhmOWY0MjY3NmYyYmJhYTUzMw`}})
  .catch(reason => {
      utils.logErrors(reason)
      throw reason
  })
//BEARER = Token
  // https://api.ticketswap.com/graphql/public/batch
}

export function parseHTML({body: $, response}: any): any {
  const listingId = $('header').attr('id')
  const availableTickets = $('form select option').length
  const splitURL = response.request.uri.path.split('/')
  const listingHash = splitURL[splitURL.length - 1]
  return {listingId, listingHash, availableTickets}
}