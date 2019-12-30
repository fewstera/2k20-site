import path from 'path'
import express from 'express'
import compression from 'compression'
import winston from 'winston'

import setErrorHandlers from './set-error-handlers'
import createRouter from './routes'
import { Config } from './infra/config'
import { MessageService } from './services/messages'
import AWS from 'aws-sdk'


export default function createAndConfigureApp({
  config,
  log
}: {
  config: Config
  log: winston.Logger
}) {
  const app = express()

  const dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    endpoint: config.get('dynamodb.endpoint'),
    region: config.get('dynamodb.region')
  })

  const dynamodbDocClient = new AWS.DynamoDB.DocumentClient({
    service: dynamodb,
  })

  const messageService = new MessageService({
    dynamodbDocClient,
    messagesTable: config.get('dynamodb.table')
  })

  // Enable gzip compression
  app.use(compression())

  // Add routes
  app.use('/', createRouter({ config, log, messageService }))

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
