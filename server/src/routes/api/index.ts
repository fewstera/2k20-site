import express from 'express'
import winston from 'winston'
import messagesRouter from './messages'

import { Config } from '../../infra/config'
import { MessageService } from '../../services/messages'

function createRouter(options: {
  config: Config
  log: winston.Logger
  messageService: MessageService
}) {
  const router = express.Router()
  router.use('/messages', messagesRouter(options))

  return router
}

export default createRouter
