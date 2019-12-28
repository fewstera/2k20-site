import express from 'express'
import messagesRouter from './messages'

function createRouter() {
  const router = express.Router()
  router.use('/messages', messagesRouter())

  return router
}

export default createRouter
