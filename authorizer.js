const { isAuthorized, runIfDev } = require('./utils')

exports.handler = function(event, context, callback) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    console.log('Error acquiring secret from env')

    throw Error('JWTSecretError')
  }

  if (!isAuthorized(event.authorizationToken, secret)) {
    callback('Unauthorized') // eslint-disable-line standard/no-callback-literal
    // the eslint-callback-literal check is disabled because it's
    // not applicable here. the check itself is designed to prevent
    // people from returning error messages as string literals instead
    // of using the Error class. This is at odds with the api provided to us.
    // Alternatively s/callback/ca_ll__back/ to avoid the linter and comment.
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
