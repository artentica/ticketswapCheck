import debug from 'debug'

import config from './config'

const logColor = 'ts:logger'
class Logger {
  public debug = (...args: any) => (this.showLogMessage(0) ? debug(logColor)(...args) : null)
  public info = (...args: any) => (this.showLogMessage(1) ? console.log(...args) : null)
  public warn = (...args: any) => (this.showLogMessage(2) ? console.log(...args) : null)
  public error = (...args: any) => (this.showLogMessage(3) ? console.error(...args) : null)

  private showLogMessage = (logLevel: number): boolean => config.logLevel <= logLevel
}

export default new Logger()
