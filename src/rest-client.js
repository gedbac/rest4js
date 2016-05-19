import Options from 'options';
import CancellationToken from 'cancellation-token';
import UrlBuilder from 'url-builder';
import RestRequestMessage from 'rest-request-message';
import RestResponseMessage from 'rest-response-message';
import RestBulkRequestMessage from 'rest-bulk-request-message';
import RestBulkResponseMessage from 'rest-bulk-response-message';
import JsonMediaTypeFormatter from 'json-media-type-formatter';
import QueryFactory from 'query-factory';
import QueryTranslator from 'query-translator';
import RestClientError from 'rest-client-error';

export default class RestClient {

  constructor(options) {
    this.scheme = 'http';
    this.host = 'localhost';
    this.port = 80;
    this.timeout = 30;
    this.defaultContentType = 'application/json; charset=utf-8';
    this.messageHandlers = [];
    this.mediaTypeFormatters = [
      new JsonMediaTypeFormatter()
    ];
    this.services = {
      queryFactory: new QueryFactory(),
      queryTranslator: new QueryTranslator()
    };
    this.interceptors = [];
    Options.assign(this, options);
  }

  send(requestMessage, cancellationToken = CancellationToken.none) {
    return new Promise((resolve, reject) => {
      try {
        if (!requestMessage.method) {
          throw new RestClientError({
            message: "Request doesn't have method defined"
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
        httpRequest = new XMLHttpRequest();
        if (requestMessage && requestMessage instanceof RestRequestMessage) {
          this._sendMessage(requestMessage, httpRequest, resolve, reject);
        } else if (requestMessage && requestMessage instanceof RestBulkRequestMessage) {
          this._sendBulkMessage(requestMessage, httpRequest, resolve, reject);
        } else {
          throw new RestClientError({
            message: "Message is undefined or it's type is invalid"
          });
        }
      } catch (ex) {
        reject(ex);
      }
    });
  }

  use(interceptor) {
    return this;
  }

  getMediaTypeFormatter(contentType) {
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

  _sendMessage(requestMessage, httpRequest, resolve, reject) {
    var url = new UrlBuilder({
      scheme: this.scheme,
      host: this.host,
      port: this.port,
      path: requestMessage.path,
      queryString: requestMessage.queryString
    }).toString();
    httpRequest.open(requestMessage.method, url, true);
    httpRequest.timeout = this.timeout;
    if ('timeout' in requestMessage && requestMessage.timeout > 0) {
      httpRequest.timeout = requestMessage.timeout;
    }
    if (!requestMessage.accept) {
      requestMessage.accept = this.defaultContentType;
    }
    httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (requestMessage.headers) {
      for (var headerName in requestMessage.headers) {
        httpRequest.setRequestHeader(headerName, requestMessage.headers[headerName]);
      }
    }
    //httpRequest.setRequestHeader('Cache-Control', 'no-cache');
    httpRequest.onreadystatechange = () => {
      if (httpRequest && httpRequest.readyState === 4) {
        this._onReceiveMessage(requestMessage, httpRequest, resolve, reject);
      }
    };
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
      httpRequest.setRequestHeader('Content-Type', contentType);
      httpRequest.send(content);
    } else {
      httpRequest.send();
    }
  }

  _onReceiveMessage(requestMessage, httpRequest, resolve, reject) {
    if (httpRequest.status !== 0) {
      var content = null;
      var contentType = httpRequest.getResponseHeader("Content-Type");
      if (httpRequest.responseText) {
        var mediaTypeFormatter = this.getMediaTypeFormatter(contentType);
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
      reject(new RestClientError({
        message: "Failed to connect to the server"
      }));
    }
  }

  _sendBulkMessage(bulkRequestMessage, httpRequest, resolve, reject) {
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

  _getUrl(scheme, host, port, path, queryString) {
    var url = '';
    if (scheme) {
      url += `${scheme}://`;
    } else {
      url += 'http://';
    }
    if (host) {
      url += `${host}`;
    } else {
      url += 'localhost';
    }
    if (port && port !== 80) {
      url += `:${port}`;
    }
    if (path) {
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
      url += path;
    }
    if (queryString) {
      url += '?' + queryString;
    }
    return url;
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