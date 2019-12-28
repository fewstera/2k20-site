import createAndConfigureApp from './server'
import { config } from './infra/config'
import { log } from './infra/logger'

const start = async () => {
  const { startApp, stopApp } = createAndConfigureApp({
    log,
    config,
  })
  setupProcessHooks(stopApp)
  await startApp()
}

start()
  .then(() => {
    log.info('Service is up')
  })
  .catch(err => {
    log.error('Startup error', err)
    exitProcessWithError('Startup error')
  })

function setupProcessHooks(stopApp) {
  process.on('uncaughtException', err => {
    log.error('Uncaught exception', err)
    exitProcessWithError('Uncaught exception')
  })

  process.on('SIGINT', () => {
    exitProcessWithError('SIGINT received, shutting down app')
  })

  process.on('SIGHUP', () => {
    log.info('SIGHUP received, stopping express server and exiting')
    stopApp()
    process.exit(0)
  })
}

function exitProcessWithError(errorMsg: string) {
  log.error('Shutting down app: ', errorMsg)
  process.exit(1)
}
