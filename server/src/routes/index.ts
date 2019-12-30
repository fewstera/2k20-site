import express from 'express'
import winston from 'winston'

import internalRouter from './internal'
import apiRouter from './api'
import { Config } from '../infra/config'
import { MessageService } from '../services/messages'

function createRouter(options: {
  config: Config
  log: winston.Logger
  messageService: MessageService
}) {
  const router = express.Router()

  router.use('/internal', internalRouter())
  router.use('/api', apiRouter(options))

  return router
}

export default createRouter
