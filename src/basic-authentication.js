import CancellationToken from 'cancellation-token';
import RestMessageInterceptorBase from 'rest-message-interceptor-base';

export default class BasicAuthentication extends RestMessageInterceptorBase {

  constructor(options) {
    super(options);
  }

  beforeSend(requestMessage, context, cancellationToken = CancellationToken.none) {
    return new Promise((resolve, reject) => {
      if (context && context.client) {
        var username = context.client.username;
        var password = context.client.password;
        if (username && password) {
          requestMessage.headers['Authorization'] = `Basic ${btoa(username + ':' + password)}`;
        }
        resolve(requestMessage);
      }
    });
  }

}