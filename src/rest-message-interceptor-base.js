import Options from 'options';
import CancellationToken from 'cancellation-token';

export default class RestMessageInterceptorBase {

  constructor(options) {
    Options.assign(this, options);
  }

  beforeSend(requestMessage, context, cancellationToken = CancellationToken.none) {
    return Promise.resolve(requestMessage);
  }

  afterSend(responseMessage, context, cancellationToken = CancellationToken.none) {
    return Promise.resolve(responseMessage);
  }

}