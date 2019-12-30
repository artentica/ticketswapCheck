import debug from 'debug'

const logColor = 'ts:logger'

class Logger {
  public debug = (...args: any) => debug(logColor)(...args)
  // tslint:disable-next-line
  public info = (...args: any) => console.log(...args)
  // tslint:disable-next-line
  public warn = (...args: any) => console.log(...args)
  // tslint:disable-next-line
  public error = (...args: any) => console.error(...args)
}

export default new Logger()
