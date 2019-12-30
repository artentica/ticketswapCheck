export default class Exception extends Error {

  constructor(message: string, name : string = 'Exception') {
      super(message)
      this.name = name
      this.message = message
  }
  public toString() {
      return this.name + ': ' + this.message;
  }
}