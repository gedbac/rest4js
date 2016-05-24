import Options from 'options';
import RestMessageHandlerBase from 'rest-message-handler-base';
import RestClientError from 'rest-client-error';
import RestRequestMessage from 'rest-request-message';
import RestResponseMessage from 'rest-response-message';

export default class RestMessageHandler extends RestMessageHandlerBase {

  constructor(options) {
    super();
    this.messageTypes.push(RestRequestMessage);
    Options.assign(this, options);
  }

  _onSend(requestMessage, httpRequest, context) {
    return new Promise((resolve, reject) => {
      try {
        httpRequest.timeout = context.client.timeout;
        if ('timeout' in requestMessage && requestMessage.timeout > 0) {
          httpRequest.timeout = requestMessage.timeout;
        }
        if (requestMessage.accept) {
          requestMessage.headers['Accept'] = requestMessage.accept;
        } else {
          requestMessage.headers['Accept'] = context.client.defaultContentType;
        }
        var content = null;
        if (requestMessage.content) {
          var contentType = requestMessage.contentType;
          if (contentType) {
            contentType = context.client.defaultContentType;
          }
          var mediaTypeFormatter = context.client.getMediaTypeFormatter(contentType);
          if (mediaTypeFormatter) {
            content = mediaTypeFormatter.write(requestMessage.content);
          } else {
            content = requestMessage.content;
          }
          requestMessage.headers['Content-Type'] = contentType;
        }
        this._setRequestHeaders(requestMessage, httpRequest, context);
        if (content) {
          httpRequest.send(content);
        } else {
          httpRequest.send();
        }
        resolve();
      } catch(error) {
        reject(error);
      }
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

}