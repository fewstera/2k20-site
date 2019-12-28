import convict from 'convict'

export type Config = convict.Config<{
  componentName: string
  env: string
  logLevel: string
  nodeEnv: string
  port: string
}>

export const config = convict({
  componentName: {
    doc: 'Component name to use in metrics and logging',
    format: String,
    env: 'COMPONENT_NAME',
    default: '2k20'
  },
  env: {
    doc: 'The deployment environment',
    format: ['ci', 'qa', 'aslive', 'live', 'local'],
    env: 'ENV_NAME',
    default: ''
  },
  logLevel: {
    doc: 'Log level to start logging at.',
    format: ['debug', 'info', 'warn', 'error'],
    env: 'LOG_LEVEL',
    default: 'debug'
  },
  nodeEnv: {
    doc: 'Running in an environment, or on a developer machine? Mainly used to decide log structure etc',
    format: ['production', 'development'],
    env: 'NODE_ENV',
    default: 'production'
  },
  port: {
    doc: 'Port for starting the app on.',
    format: 'port',
    env: 'PORT',
    default: '8000'
  }
}) as Config

config.validate({ allowed: 'strict' })
