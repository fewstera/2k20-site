import express from 'express'

function createRouter() {
  const router = express.Router()
  router.get('/', (_, res) => {
    res.send({ msg: 'Hello, World' })
  })

  return router
}

export default createRouter
