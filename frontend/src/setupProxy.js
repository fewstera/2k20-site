/* istanbul ignore file */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const proxy = require('http-proxy-middleware')

// This proxy file sets up a proxy for all requests with /stringer to go to the server.
//
// This is only used when running the webpack-dev-server in development mode. It's
// useful to allow API requests to be sent to the backen
module.exports = function(app) {
  app.use(proxy('/api', { target: 'http://server:11080/' }))
  app.use(proxy('/internal', { target: 'http://server:11080/' }))
}
