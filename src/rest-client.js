import Options from 'options';
import CancellationToken from 'cancellation-token';
import RestClientError from 'rest-client-error';
import RestMessageContext from 'rest-message-context';
import RestBulkResponseMessage from 'rest-bulk-response-message';
import MediaTypeFormatterBase from 'media-type-formatter-base';
import JsonMediaTypeFormatter from 'json-media-type-formatter';
import RestMessageHandlerBase from 'rest-message-handler-base';
import RestMessageHandler from 'rest-message-handler';
import NoCaching from 'no-caching';
import BasicAuthentication from 'basic-authentication';
import QueryFactory from 'query-factory';
import QueryTranslator from 'query-translator';
import UrlBuilder from 'url-builder';
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
      new RestMessageHandler()
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

  _sendBulkMessage(bulkRequestMessage, httpRequest, resolve, reject) {
    if (!bulkRequestMessage.method) {
      throw new RestClientError({
        message: "Request doesn't have method defined"
      });
    }
    var url = new UrlBuilder({
      scheme: this.scheme,
      host: this.host,
      port: this.port,
      path: bulkRequestMessage.path,
      queryString: bulkRequestMessage.queryString
    }).toString();
    httpRequest.open(bulkRequestMessage.method, url, true);
    httpRequest.timeout = this.timeout;
    if ('timeout' in bulkRequestMessage && bulkRequestMessage.timeout > 0) {
      httpRequest.timeout = bulkRequestMessage.timeout;
    }
    bulkRequestMessage.accept = 'multipart/mixed';
    httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (bulkRequestMessage.headers) {
      for (var headerName in bulkRequestMessage.headers) {
        httpRequest.setRequestHeader(headerName, bulkRequestMessage.headers[headerName]);
      }
    }
    httpRequest.onreadystatechange = () => {
      if (httpRequest && httpRequest.readyState === 4) {
        this._onReceiveBulkMessage(bulkRequestMessage, httpRequest, resolve, reject);
      }
    };
    if (bulkRequestMessage.requestMessages && bulkRequestMessage.requestMessages.length > 0) {
      var content = '';
      var boundary = bulkRequestMessage.boundary || 'gc0p4Jq0M2Yt08jU534c0p';
      httpRequest.setRequestHeader('Content-Type', `multipart/mixed; boundary="${boundary}"`);
      bulkRequestMessage.requestMessages.forEach(requestMessage => {
        content = this._appendRequestMessageToContent(requestMessage, content, boundary);
      });
      content += `--${boundary}--`;
      httpRequest.send(content);
    } else {
      httpRequest.send();
    }
  }

  _appendRequestMessageToContent(requestMessage, output, boundary) {
    if (!requestMessage.method) {
      throw new RestClientError({
        message: "Request doesn't have method defined"
      });
    }
    if (!requestMessage.path) {
      throw new RestClientError({
        message: "Request doesn't have path defined"
      });
    }
    output += `--${boundary}\r\n`;
    output += 'application/http; msgtype=request\r\n\r\n';
    output += `${requestMessage.method} ${requestMessage.path} HTTP/1.1\r\n`;
    if (requestMessage.headers) {
      for (var headerName in requestMessage.headers) {
        output += `${headerName}: ${requestMessage.headers[headerName]}`;
      }
    }
    if (requestMessage.content) {
      var content = null;
      var contentType = requestMessage.contentType;
      if (contentType) {
        contentType = this.defaultContentType;
      }
      var mediaTypeFormatter = this.getMediaTypeFormatter(contentType);
      if (mediaTypeFormatter) {
        content = mediaTypeFormatter.write(requestMessage.content);
      } else {
        content = requestMessage.content;
      }
      output += `Content-Type: ${contentType}`;
      output += content;
    }
    return output;
  }

  _onReceiveBulkMessage(bulkRequestMessage, httpRequest, resolve, reject) {
    // TODO: not implemented
    resolve(new RestBulkResponseMessage({
      requestMessage: bulkRequestMessage
    }));
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