import Options from 'options';
import CancellationToken from 'cancellation-token';

export default class RestMessageInterceptorBase {

  constructor(options) {
    Options.assign(this, options);
  }

  beforeSend(requestMessage, context, cancellationToken = CancellationToken.none) {
    return Promise.resolve(requestMessage);
  }

  afterReceive(responseMessage, context, cancellationToken = CancellationToken.none) {
    return Promise.resolve(responseMessage);
  }

}