import Options from 'options';
import CancellationToken from 'cancellation-token';
import RestRequestMessage from 'rest-request-message';
import RestResponseMessage from 'rest-response-message';
import RestBulkRequestMessage from 'rest-bulk-request-message';
import RestBulkResponseMessage from 'rest-bulk-response-message';
import JsonMediaTypeFormatter from 'json-media-type-formatter';
import QueryFactory from 'query-factory';
import QueryTranslator from 'query-translator';
import RestClientError from 'rest-client-error';

const DONE = 4;

export default class RestClient {

  constructor(options) {
    this.protocol = 'http';
    this.host = 'localhost';
    this.port = 80;
    this.timeout = 30;
    this.mediaTypeFormatters = [
      new JsonMediaTypeFormatter()
    ];
    this.services = {
      queryFactory: new QueryFactory(),
      queryTranslator: new QueryTranslator()
    };
    this.interceptors = [];
    Options.extend(this, options);
  }

  send(requestMessage, cancellationToken = CancellationToken.none) {
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
        httpRequest = new XMLHttpRequest();
        if (requestMessage && requestMessage instanceof RestRequestMessage) {
          this._sendMessage(requestMessage, httpRequest, resolve, reject);
        } else if (requestMessage && requestMessage instanceof RestBulkRequestMessage) {
          this._sendBulkMessage(requestMessage, httpRequest, resolve, reject);
        } else {
          throw RestClientError({
            message: "Message is undefined or it's type is invalid"
          });
        }
      } catch (ex) {
        reject(ex);
      }
    });
  }

  _sendMessage(requestMessage, httpRequest, resolve, reject) {
    var url = '';
    if (this.protocol) {
      url += `${this.protocol}://`;
    } else {
      url += 'http://';
    }
    if (this.host) {
      url += `${this.host}`;
    } else {
      url += 'localhost';
    }
    if (this.port && this.port !== 80) {
      url += `:${this.port}`;
    }
    if (!requestMessage.path.startsWith('/')) {
      requestMessage.path = '/' + requestMessage.path;
    }
    url += requestMessage.path;
    if (requestMessage.queryString) {
      url += '?' + requestMessage.queryString;
    }
    httpRequest.open(requestMessage.method, url, true);
    httpRequest.timeout = this.timeout;
    if ('timeout' in requestMessage && requestMessage.timeout > 0) {
      httpRequest.timeout = requestMessage.timeout;
    }
    if (!requestMessage.accept) {
      requestMessage.accept = 'application/json';
    }
    httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (requestMessage.headers) {
      for (var headerName in requestMessage.headers) {
        httpRequest.setRequestHeader(headerName, requestMessage.headers[headerName]);
      }
    }
    httpRequest.onreadystatechange = () => {
      if (httpRequest && httpRequest.readyState === DONE) {
        if (httpRequest.status !== 0) {
          var content = null;
          var contentType = httpRequest.getResponseHeader("Content-Type");
          if (httpRequest.responseText) {
            var mediaTypeFormatter = this._getMediaTypeFormatter(contentType);
            if (mediaTypeFormatter) {
              content = mediaTypeFormatter.read(httpRequest.responseText);
            } else {
              content = httpRequest.responseText;
            }
          }
          var headers = this._getResponseHeaders(httpRequest);
          resolve(new RestResponseMessage({
            requestMessage: requestMessage,
            status: httpRequest.status,
            statusText: httpRequest.statusText,
            headers: headers,
            content: content,
            contentType: contentType
          }));
        } else {
          reject(RestClientError({
            message: "Failed to connect to the server"
          }));
        }
      }
    };
    httpRequest.send();
  }

  _sendBulkMessage(bulkRequestMessage, httpRequest, resolve, reject) {
    setTimeout(() => {
      resolve(new RestBulkResponseMessage());
    }, 5000);
  }

  _getMediaTypeFormatter(contentType) {
    var mediaTypeFormatter = null;
    if (contentType && this.mediaTypeFormatters && this.mediaTypeFormatters.length > 0) {
      for (var i = 0; i < this.mediaTypeFormatters.length; i++) {
        if (this.mediaTypeFormatters[i].contentType === contentType) {
          mediaTypeFormatter = this.mediaTypeFormatters[i];
          break;
        }
      }
    }
    return mediaTypeFormatter;
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