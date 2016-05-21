import Options from 'options';
import CancellationToken from 'cancellation-token';
import RestMessageHandlerBase from 'rest-message-handler-base';
import RestClientError from 'rest-client-error';
import UrlBuilder from 'url-builder';
import RestRequestMessage from 'rest-request-message';
import RestResponseMessage from 'rest-response-message';

export default class RestMessageHandler extends RestMessageHandlerBase {

  constructor(options) {
    super();
    this.messageTypes.push(RestRequestMessage);
    Options.assign(this, options);
  }

  send(requestMessage, context, cancellationToken = CancellationToken.none) {
    return new Promise((resolve, reject) => {
      try {
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
        var client = context.client;
        httpRequest = new XMLHttpRequest();
        var url = new UrlBuilder({
          scheme: client.scheme,
          host: client.host,
          port: client.port,
          path: requestMessage.path,
          queryString: requestMessage.queryString
        }).toString();
        httpRequest.open(requestMessage.method, url, true);
        httpRequest.timeout = client.timeout;
        if ('timeout' in requestMessage && requestMessage.timeout > 0) {
          httpRequest.timeout = requestMessage.timeout;
        }
        this._setRequestHeaders(requestMessage, httpRequest, context);
        httpRequest.onreadystatechange = () => {
          if (httpRequest && httpRequest.readyState === 4) {
            this._onReceive(requestMessage, httpRequest, context)
              .then(responseMessage => {
                return this._onAfterReceive(responseMessage, context);
              })
              .then(responseMessage => {
                resolve(responseMessage);
              })
              .catch(reason => {
                reject(reason);
              });
          }
        };
        var content = null;
        if (requestMessage.content) {
          var contentType = requestMessage.contentType;
          if (contentType) {
            contentType = client.defaultContentType;
          }
          var mediaTypeFormatter = client.getMediaTypeFormatter(contentType);
          if (mediaTypeFormatter) {
            content = mediaTypeFormatter.write(requestMessage.content);
          } else {
            content = requestMessage.content;
          }
          httpRequest.setRequestHeader('Content-Type', contentType);
        }
        this._onBeforeSend(requestMessage, context)
          .then(() => {
            return this._onSend(content, httpRequest, context);
          })
          .catch(reason => {
            reject(reason);
          });
      } catch(error) {
        reject(error);
      }
    });
  }

  _setRequestHeaders(requestMessage, httpRequest, context) {
    httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (requestMessage.accept) {
      httpRequest.setRequestHeader('Accept', requestMessage.accept);
    } else {
      httpRequest.setRequestHeader('Accept', context.client.defaultContentType);
    }
    if (requestMessage.headers) {
      for (var name in requestMessage.headers) {
        httpRequest.setRequestHeader(name, requestMessage.headers[headerName]);
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

  _onSend(content, httpRequest, context) {
    return new Promise((resolve, reject) => {
      if (content) {
        httpRequest.send(content);
      } else {
        httpRequest.send();
      }
      resolve();
    });
  }

  _onReceive(requestMessage, httpRequest, context) {
    return new Promise((resolve, reject) => {
      if (httpRequest.status !== 0) {
        var responseMessage = new RestResponseMessage({
          requestMessage: requestMessage,
          status: httpRequest.status,
          statusText: httpRequest.statusText,
          headers: this._getResponseHeaders(httpRequest)
        });
        if (httpRequest.responseText) {
          var content = null;
          var contentType = httpRequest.getResponseHeader("Content-Type");
          var mediaTypeFormatter = context.client.getMediaTypeFormatter(contentType);
          if (mediaTypeFormatter) {
            content = mediaTypeFormatter.read(httpRequest.responseText);
          } else {
            content = httpRequest.responseText;
          }
          responseMessage.contentType = contentType;
          responseMessage.content = content;
        }
        resolve(responseMessage);
      } else {
        reject(new RestClientError({
          message: "Failed to connect to the server"
        }));
      }
    });
  }

  _onBeforeSend(requestMessage, context) {
    return Promise.resolve(requestMessage);
  }

  _onAfterReceive(responseMessage, context) {
    return Promise.resolve(responseMessage);
  }

}