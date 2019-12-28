'use strict'
import { config } from './config'
import winston, { format } from 'winston'
import { Config } from './config'
import { MESSAGE, SPLAT } from 'triple-beam'

// https://medium.com/@stieg/winston-3-and-logging-error-stacks-cf70b2111289
const errorHunter = format(info => {
  if (info.error) return info

  const splat = info[SPLAT] || []
  splat.unshift(info)

  info.error = splat.find(obj => obj instanceof Error)

  return info
})

const errorPrinter = format(info => {
  if (!info.error) return info

  // Handle case where Error has no stack.
  const errorMsg = info.error.stack || info.error.toString()
  info.message += `\n${errorMsg}`

  return info
})

export default function createLogger(config: Config): winston.Logger {
  return config.get('nodeEnv') === 'development'
    ? createDevelopmentWinstonLogger(config.get('logLevel'))
    : createProductionWinstonLogger(config.get('logLevel'), config.get('env'), config.get('componentName'))
}

const createDevelopmentWinstonLogger = (level: string): winston.Logger =>
  winston.createLogger({
    exitOnError: true,
    format: format.combine(
      format.colorize(),
      format.prettyPrint(),
      format.splat(),
      errorHunter(),
      errorPrinter(),
      format.printf(info => `${info.level}: ${info.message}`)
    ),
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
        level
      })
    ]
  })

const createProductionWinstonLogger = (level: string, env: string, component: string): winston.Logger => {
  if (level === null) {
    throw new Error('logLevel required')
  }
  if (env === null) {
    throw new Error('env required')
  }
  if (component === null) {
    throw new Error('component required')
  }

  return winston.createLogger({
    exitOnError: false,
    format: format.combine(
      format.splat(),
      errorHunter(),
      format(info => {
        const message = {
          level: info.level,
          component,
          env,
          message: info.message,
          timestamp: new Date(),
          stack: info.error ? info.error.stack : undefined,
          meta: info.meta
        }

        info[MESSAGE] = JSON.stringify(message)

        return info
      })()
    ),
    transports: [
      new winston.transports.Console({
        // logs and handles uncaught exceptions
        handleExceptions: true,
        level
      })
    ]
  })
}

export const log = createLogger(config)
