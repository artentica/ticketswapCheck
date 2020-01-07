import * as chalk from 'chalk'

import logger from './logger'
import request from './request'
import * as utils from './utils'
// const utils = require('./utils');

// export function reserve({ form, csrf, availableTickets, _endpoint }, link, options) {}

export async function runFound(link, options): Promise<any> {
  // STEP 1 submit form
  // STEP 2 request /cart

  return request(link)
    .then(parseHTML)
    .then(({ listingId, listingHash, availableTickets }) => process(listingId, listingHash, availableTickets, options))
    .then(data => {
      const [result, amountOfTickets] = data
      if (result.alreadySold) {
        return result
      }
      return {
        alreadySold: false,
        amountOfTickets
      }
    })
}

async function process(listingId: string, listingHash: string, availableTickets: number, options: any): Promise<any> {
  if (!availableTickets) return Promise.resolve({ alreadySold: true })
  const amountOfTickets = Math.min(options.amount, availableTickets)
  const body = [
    {
      operationName: 'addTicketsToCart',
      variables: {
        input: {
          listingId,
          listingHash,
          amountOfTickets
        }
      },
      query: `mutation addTicketsToCart($input: AddTicketsToCartInput!) {
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

  logger.info(
    [
      ``,
      `${chalk.green('Reserving ticket')}:`,
      //` ${chalk.magenta('token')}           : ${token}`,
      // ` ${chalk.magenta('reserve[_token]')} : ${reserveToken}`,
      // ` ${chalk.magenta('csrf_token')}      : ${csrf}`,
      ` ${chalk.magenta('amount')}          : ${amountOfTickets}`,
      ``
    ].join('\n')
  )

  return await Promise.all([
    request('https://api.ticketswap.com/graphql/public/batch', {
      method: 'POST',
      json: true,
      body,
      headers: {
        authorization: `Bearer ZmFhNWVhZjBiOGU4NmNhMjcwZTBkYTRlOTc0NGU1MGFiY2ViZWM0ZDgzODhmYzhmOWY0MjY3NmYyYmJhYTUzMw`
      }
    }),
    amountOfTickets
  ]).catch(reason => {
    utils.logErrors(reason)
    throw reason
  })
  //BEARER = Token
  // https://api.ticketswap.com/graphql/public/batch
}

function parseHTML({ body: $, response }: any): any {
  const listingId = $('header').attr('id')
  const availableTickets = $('form select option').length
  const splitURL = response.request.uri.path.split('/')
  const listingHash = splitURL[splitURL.length - 1]
  return { listingId, listingHash, availableTickets }
}
