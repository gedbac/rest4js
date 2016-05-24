import Options from 'options';
import CancellationToken from 'cancellation-token';
import RestClientError from 'rest-client-error';
import RestMessageContext from 'rest-message-context';
import MediaTypeFormatterBase from 'media-type-formatter-base';
import JsonMediaTypeFormatter from 'json-media-type-formatter';
import RestMessageHandlerBase from 'rest-message-handler-base';
import RestMessageHandler from 'rest-message-handler';
import RestBulkMessageHandler from 'rest-bulk-message-handler';
import NoCaching from 'no-caching';
import BasicAuthentication from 'basic-authentication';
import QueryFactory from 'query-factory';
import QueryTranslator from 'query-translator';
import RetryPolicy from 'retry-policy';

export default class RestClient {

  constructor(options) {
    this.scheme = 'http';
    this.host = 'localhost';
    this.port = 80;
    this.timeout = 30;
    this.username = null;
    this.password = null;
    this.defaultContentType = 'application/json';
    this.retryPolicy = new RetryPolicy();
    this.mediaTypeFormatters = [
      new JsonMediaTypeFormatter()
    ];
    this.messageHandlers = [
      new RestMessageHandler(),
      new RestBulkMessageHandler()
    ];
    this.services = {
      queryFactory: new QueryFactory(),
      queryTranslator: new QueryTranslator()
    };
    this.messageInterceptors = [
      new NoCaching(),
      new BasicAuthentication()
    ];
    Options.assign(this, options);
  }

  send(requestMessage, cancellationToken = CancellationToken.none) {
    return new Promise((resolve, reject) => {
      try {
        cancellationToken.throwIfCanceled();
        if (!requestMessage) {
          throw new RestClientError({
            message: "Parameter 'requestMessage' is not passed to the method 'send' of class 'RestClient'"
          });
        }
        var messageHandler = this.getMessageHandler(requestMessage);
        if (!messageHandler) {
          throw new RestClientError({
            message: `Message handler is not defined for request message of type '${requestMessage.constructor.name}'`
          });
        }
        var context = new RestMessageContext({
          client: this
        });
        messageHandler
          .send(requestMessage, context, cancellationToken)
          .then(resolve, reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  use(value) {
    if (value) {
      if (value instanceof MediaTypeFormatterBase) {
        this.mediaTypeFormatters.push(value);
      } else if (value instanceof RestMessageHandlerBase) {
        this.messageHandlers.push(value);
      } else if (value instanceof RestMessageInterceptorBase) {
        this.messageInterceptors.push(value);
      }
    }
    return this;
  }

  getMessageHandler(requestMessage) {
    var messageHandler = null;
    if (requestMessage && this.messageHandlers && this.messageHandlers instanceof Array) {
      for (var i = 0; i < this.messageHandlers.length; i++) {
        if (this.messageHandlers[i].messageTypes &&
          this.messageHandlers[i].messageTypes instanceof Array &&
          this.messageHandlers[i].messageTypes.indexOf(requestMessage.constructor) !== -1) {
          messageHandler = this.messageHandlers[i];
          break;
        }
      }
    }
    return messageHandler;
  }

  getMediaTypeFormatter(contentType) {
    var mediaTypeFormatter = null;
    if (contentType && this.mediaTypeFormatters && this.mediaTypeFormatters instanceof Array) {
      for (var i = 0; i < this.mediaTypeFormatters.length; i++) {
        if (this.mediaTypeFormatters[i].mediaTypes &&
          this.mediaTypeFormatters[i].mediaTypes instanceof Array &&
          this.mediaTypeFormatters[i].mediaTypes.indexOf(contentType) !== -1) {
          mediaTypeFormatter = this.mediaTypeFormatters[i];
          break;
        }
      }
    }
    return mediaTypeFormatter;
  }

}