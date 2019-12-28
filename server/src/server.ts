import path from 'path'
import express from 'express'
import compression from 'compression'
import winston from 'winston'

import setErrorHandlers from './set-error-handlers'
import createRouter from './routes'
import { Config } from './infra/config'


export default function createAndConfigureApp({
  config,
  log
}: {
  config: Config
  log: winston.Logger
}) {
  const app = express()

  // Enable gzip compression
  app.use(compression())

  // Add routes
  app.use('/', createRouter({ config, log  }))

  setErrorHandlers({ app, log })

  let server
  function startApp() {
    return new Promise((resolve, reject) => {
      try {
        server = app.listen(config.get('port'), () => {
          log.info(`Started on port ${server.address().port}`)
          return resolve()
        })
        server.once('error', reject)
      } catch (err) {
        reject(err)
      }
    })
  }

  function stopApp() {
    if (server) {
      server.close()
    }
  }

  return { app, startApp, stopApp }
}
