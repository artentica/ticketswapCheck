import debug from 'debug'

const logColor = 'ts:logger'

class Logger {
  public debug = (...args: any) => debug(logColor)(...args);
  public info = (...args: any) => console.log(...args);
  public warn = (...args: any) => console.log(...args);
  public error = (...args: any) => console.error(...args);
}

export default new Logger()