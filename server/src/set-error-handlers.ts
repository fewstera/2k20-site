import { Express } from 'express'
import winston = require('winston')

function setErrorHandlers({
  app,
  log,
}: {
  app: Express
  log: winston.Logger
}) {
  app.all('*', (_, res) => {
    res.sendStatus(404)
  })

  app.use([
    (err, _, res, __) => {
      log.error('Express error caught', err)

      res.sendStatus(500)
    }
  ])
}

export default setErrorHandlers
