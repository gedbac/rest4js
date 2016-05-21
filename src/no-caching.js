import CancellationToken from 'cancellation-token';
import RestMessageInterceptorBase from 'rest-message-interceptor-base';

export default class NoCaching extends RestMessageInterceptorBase {

  constructor(options) {
    super(options);
  }

  beforeSend(requestMessage, context, cancellationToken = CancellationToken.none) {
    return new Promise((resolve, reject) => {
      requestMessage.headers['Cache-Control'] = 'no-cache';
      resolve(requestMessage);
    });
  }

}