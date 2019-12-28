import express from 'express'
import winston from 'winston'

import internalRouter from './internal'
import apiRouter from './api'
import { Config } from '../infra/config'

function createRouter(options: {
  config: Config
  log: winston.Logger
}) {
  const router = express.Router()

  router.use('/internal', internalRouter())
  router.use('/api', apiRouter())

  return router
}

export default createRouter
