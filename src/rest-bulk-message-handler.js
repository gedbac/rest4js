import Options from 'options';
import RestMessageHandlerBase from 'rest-message-handler-base';
import RestClientError from 'rest-client-error';
import RestBulkRequestMessage from 'rest-bulk-request-message';
import RestBulkResponseMessage from 'rest-bulk-response-message';

export default class RestBulkMessageHandler extends RestMessageHandlerBase {

  constructor(options) {
    super();
    this.messageTypes.push(RestBulkRequestMessage);
    Options.assign(this, options);
  }

  _onSend(bulkRequestMessage, httpRequest, context) {
    return new Promise((resolve, reject) => {
      try {
        httpRequest.timeout = context.client.timeout;
        if ('timeout' in bulkRequestMessage && bulkRequestMessage.timeout > 0) {
          httpRequest.timeout = bulkRequestMessage.timeout;
        }
        var content = '';
        bulkRequestMessage.headers['Accept'] = 'multipart/mixed';
        if (bulkRequestMessage.requestMessages && bulkRequestMessage.requestMessages.length > 0) {
          var boundary = bulkRequestMessage.boundary || 'gc0p4Jq0M2Yt08jU534c0p';
          bulkRequestMessage.headers['Content-Type'] = `multipart/mixed; boundary="${boundary}"`;
          bulkRequestMessage.requestMessages.forEach(requestMessage => {
            content += this._write(requestMessage, boundary);
          });
          content += `--${boundary}--`;
        }
        this._setRequestHeaders(bulkRequestMessage, httpRequest, context);
        if (content) {
          httpRequest.send(content);
        } else {
          httpRequest.send();
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  _onReceive(bulkRequestMessage, httpRequest, context) {
    return new Promise((resolve, reject) => {
      if (httpRequest.status !== 0) {
        var bulkResponseMessage = new RestBulkResponseMessage({
          requestMessage: bulkRequestMessage,
          status: httpRequest.status,
          statusText: httpRequest.statusText,
          headers: this._getResponseHeaders(httpRequest)
        });
        // TODO: parse response...
        resolve(bulkResponseMessage);
      } else {
        reject(new RestClientError({
          message: "Failed to connect to the server"
        }));
      }
    });
  }

  _write(requestMessage, boundary, context) {
    var content = '';
    content += `--${boundary}\r\n`;
    content += 'application/http; msgtype=request\r\n\r\n';
    content += `${requestMessage.method} ${requestMessage.path} HTTP/1.1\r\n`;
    if (requestMessage.headers) {
      for (var headerName in requestMessage.headers) {
        content += `${headerName}: ${requestMessage.headers[headerName]}`;
      }
    }
    if (requestMessage.content) {
      var contentType = requestMessage.contentType;
      if (contentType) {
        contentType = context.client.defaultContentType;
      }
      content += `Content-Type: ${contentType}`;
      var mediaTypeFormatter = context.client.getMediaTypeFormatter(contentType);
      if (mediaTypeFormatter) {
        content += mediaTypeFormatter.write(requestMessage.content);
      } else {
        content += requestMessage.content;
      }
    }
    return content;
  }

}