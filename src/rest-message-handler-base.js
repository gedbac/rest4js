import Options from 'options';
import CancellationToken from 'cancellation-token';
import RestClientError from 'rest-client-error';
import UrlBuilder from 'url-builder';

const DONE = 4;

export default class RestMessageHandlerBase {

  constructor(options) {
    this.messageTypes = [];
    Options.assign(this, options);
  }

  send(requestMessage, context, cancellationToken = CancellationToken.none) {
    return new Promise((resolve, reject) => {
      try {
        if (!requestMessage) {
          throw new RestClientError({
            message: "Parameter 'requestMessage' is not passed to the method 'send' of class 'RestMessageHandler'"
          });
        }
        if (!requestMessage.method) {
          throw new RestClientError({
            message: "Method is not defined in request message"
          });
        }
        if (!context) {
          throw new RestClientError({
            message: "Parameter 'context' is not passed to the method 'send' of class 'RestMessageHandler'"
          });
        }
        if (!context.client) {
          throw new RestClientError({
            message: "Rest client is not define in context"
          });
        }
        var httpRequest = null;
        cancellationToken.throwIfCanceled();
        cancellationToken.register(() => {
          try {
            if (httpRequest) {
              httpRequest.abort();
            }
            cancellationToken.throwIfCanceled();
          } catch (ex) {
            reject(ex);
          }
        });
        var url = new UrlBuilder({
          scheme: context.client.scheme,
          host: context.client.host,
          port: context.client.port,
          path: requestMessage.path,
          queryString: requestMessage.queryString
        }).toString();
        httpRequest = new XMLHttpRequest();
        httpRequest.open(requestMessage.method, url, true);
        httpRequest.onreadystatechange = () => {
          if (httpRequest && httpRequest.readyState === DONE) {
            this._onReceive(requestMessage, httpRequest, context)
              .then(responseMessage => {
                return this._onAfterReceive(responseMessage, context, cancellationToken);
              })
              .then(responseMessage => {
                resolve(responseMessage);
              })
              .catch(reason => {
                reject(reason);
              });
          }
        };
        this._onBeforeSend(requestMessage, context, cancellationToken)
          .then(() => {
            return this._onSend(requestMessage, httpRequest, context);
          })
          .catch(reason => {
            reject(reason);
          });
      } catch(error) {
        reject(error);
      }
    });
  }

  _onSend(requestMessage, httpRequest, context) {
    throw new RestClientError({
      message: "Method '_onSend' is not supported for class 'RestMessageHandlerBase'"
    });
  }

  _onReceive(requestMessage, httpRequest, context) {
    throw new RestClientError({
      message: "Method '_onReceive' is not supported for class 'RestMessageHandlerBase'"
    });
  }

  _onBeforeSend(requestMessage, context, cancellationToken) {
    if (context.client.messageInterceptors) {
      var messageInterceptors = context.client.messageInterceptors;
      var p = Promise.resolve(requestMessage);
      messageInterceptors.forEach(interceptor => {
        p.then(message => {
          return interceptor.beforeSend(message, context, cancellationToken);
        });
      });
      return p;
    }
    return Promise.resolve(requestMessage);
  }

  _onAfterReceive(responseMessage, context, cancellationToken) {
    if (context.client.messageInterceptors) {
      var messageInterceptors = context.client.messageInterceptors;
      var p = Promise.resolve(responseMessage);
      messageInterceptors.forEach(interceptor => {
        p.then(message => {
          return interceptor.afterReceive(message, context, cancellationToken);
        });
      });
      return p;
    }
    return Promise.resolve(responseMessage);
  }

  _setRequestHeaders(requestMessage, httpRequest, context) {
    httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (requestMessage.headers) {
      for (var name in requestMessage.headers) {
        httpRequest.setRequestHeader(name, requestMessage.headers[name]);
      }
    }
  }

  _getResponseHeaders(httpRequest) {
    var headers = {};
    var text = httpRequest.getAllResponseHeaders();
    if (text) {
      var pairs = text.split('\r\n');
      pairs.forEach(pair => {
        if (pair) {
          var name = pair.substring(0, pair.indexOf(':'));
          var value = pair.substring(pair.indexOf(':') + 2, pair.length);
          headers[name] = value;
        }
      });
    }
    return headers;
  }

}