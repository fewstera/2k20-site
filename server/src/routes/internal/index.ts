import express from 'express'

function createInternalRouter() {
  const router = express.Router()
  router.get('/healthcheck', (_, res) => {
    res.send('Healthy')
  })

  return router
}

export default createInternalRouter
