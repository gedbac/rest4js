import Options from 'options';
import CancellationToken from 'cancellation-token';
import RestClientError from 'rest-client-error';

export default class RestMessageHandlerBase {

  constructor(options) {
    this.messageTypes = [];
    Options.assign(this, options);
  }

  send(requestMessage, context, cancellationToken = CancellationToken.none) {
    throw new RestClientError({
      message: "Method 'send' is not supported for class 'RestMessageHandlerBase'"
    });
  }

}