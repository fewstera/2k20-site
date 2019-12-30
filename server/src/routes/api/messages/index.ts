import express from 'express'
import winston from 'winston'
import bodyParser from 'body-parser'

import { Config } from '../../../infra/config'
import { MessageService } from '../../../services/messages'

function createRouter({ log, messageService }: {
  config: Config
  log: winston.Logger
  messageService: MessageService
}) {
  const router = express.Router()

  router.use(bodyParser.json({ type: '*/*' }))

  router.get('/', async (req, res) => {
    try {
      const since = parseInt(req.query.since) || 0
      res.send({ messages: await messageService.getMessages({ since }) })
    } catch (e) {
      log.error(e)
      res.status(500).send({
        error: `Error retrieving messages: ${e}`
      })
    }

  })

  router.post('/', async (req, res) => {
    const { from, message } = req.body
    if (!from || !message) {
      res.status(400).send({
        error: 'Bad request, missing required field'
      })
      return
    }

    try {
     await messageService.addMessage({ from, message })
     res.send({ message: 'Submitted message' })
    } catch (e) {
      log.error(e)
      res.status(500).send({
        error: `Error submitting message: ${e}`
      })
    }
  })

  return router
}

export default createRouter
