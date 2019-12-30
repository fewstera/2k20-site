import express from 'express'
import winston from 'winston'
import path from 'path'

import internalRouter from './internal'
import apiRouter from './api'
import { Config } from '../infra/config'
import { MessageService } from '../services/messages'

function createRouter(options: {
  config: Config
  log: winston.Logger
  messageService: MessageService
}) {
  const { config } = options
  const router = express.Router()

  router.use('/internal', internalRouter())
  router.use('/api', apiRouter(options))

  if (config.get('nodeEnv') === 'production') {
    router.use('/',
      express.static(
        path.join(__dirname, '../../frontend')
      )
    )

    router.get('/*', function(req, res) {
      res.sendFile(path.join(__dirname, '../../frontend', 'index.html'))
    })
  }

  return router
}

export default createRouter
