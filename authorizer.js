const { isAuthorized, runIfDev } = require('./utils')

exports.handler = function(event, context, callback) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    console.log('Error acquiring secret from env')

    throw Error('JWTSecretError')
  }

  if (!isAuthorized(event.authorizationToken, secret)) {
    callback('Unauthorized') // eslint-disable-line standard/no-callback-literal
  }

  callback(null, {
    principalId: event.authorizationToken,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: 'arn:aws:execute-api:*'
        }
      ]
    }
  })
}

runIfDev(exports.handler)
