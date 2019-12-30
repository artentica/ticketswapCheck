import Exception from './exception'

export default class NotSignedError extends Exception {
  constructor(message: string) {
    super(message, 'NotSignedError')
  }
}