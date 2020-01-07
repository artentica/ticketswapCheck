// export default class error extends Error {
//     static NotSignedInError: Error;
//   constructor(m?: string) {
//       super(m);

//       // Set the prototype explicitly.
//       Object.setPrototypeOf(this, error.prototype);
//   }

//   public DepletedTicketsError(message) {
//     this.message = message;
//     this.stack = (new Error()).stack;
//   }
//   NotSignedInError() {
//     this.stack = (new Error()).stack;
//   }
// }

class Exception extends Error {
  constructor(message: string, name: string = 'Exception') {
    super(message)
    this.name = name
    this.message = message
  }
  public toString() {
    return this.name + ': ' + this.message
  }
}

export class NotSignedError extends Exception {
  constructor(message: string) {
    super(message, 'NotSignedError')
  }
}

export class NoTicketsFoundError extends Exception {
  constructor(message: string) {
    super(message, 'NoTicketsFoundError')
  }
}

export class DepletedTicketsError extends Exception {
  constructor(message: string) {
    super(message, 'DepletedTicketsError')
  }
}
