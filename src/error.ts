export default class error extends Error {
  constructor(m: string) {
      super(m);

      // Set the prototype explicitly.
      Object.setPrototypeOf(this, error.prototype);
  }

  DepletedTicketsError(message) {
    this.message = message;
    this.stack = (new Error()).stack;
  }
  NoTicketsFoundError(message) {
    this.message = message;
    this.stack = (new Error()).stack;
  }
  NotSignedInError(message) {
    this.message = message;
    this.stack = (new Error()).stack;
  }
}