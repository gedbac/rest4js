(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rest = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BatchExecutionContext {

  constructor(options) {
    this.batch = null;
    this.client = null;
    this.requestMessages = [];
    _options2.default.extend(this, options);
  }

  static get current() {
    var activeExecutionContexts = BatchExecutionContext.activeExecutionContexts;
    if (activeExecutionContexts && activeExecutionContexts.length > 0) {
      return activeExecutionContexts[activeExecutionContexts.length - 1];
    }
    return null;
  }

  static begin(options) {
    var context = new BatchExecutionContext(options);
    if (!BatchExecutionContext.activeExecutionContexts) {
      BatchExecutionContext.activeExecutionContexts = [];
    }
    BatchExecutionContext.activeExecutionContexts.push(context);
  }

  static end() {
    if (BatchExecutionContext.activeExecutionContexts) {
      BatchExecutionContext.activeExecutionContexts.pop();
    }
  }
}
exports.default = BatchExecutionContext;

},{"options":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cancellationToken = require("cancellation-token");

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

var _batchExecutionContext = require("batch-execution-context");

var _batchExecutionContext2 = _interopRequireDefault(_batchExecutionContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Batch {

  constructor() {
    this._operations = [];
  }

  add(operation) {
    if (operation && typeof operation === 'function') {
      this._operations.push(operation);
    } else {
      throw {
        message: "Operation is not defined or it's type is invalid"
      };
    }
    return this;
  }

  execute(cancellationToken = _cancellationToken2.default.none) {
    return new Promise((resolve, reject) => {
      try {
        if (this._operations && this._operations.length > 0) {
          _batchExecutionContext2.default.begin({
            batch: this
          });
          this._operations.forEach(operation => {
            operation();
          });
          _batchExecutionContext2.default.end();
        }
        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

}
exports.default = Batch;

},{"batch-execution-context":1,"cancellation-token":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cancellationToken = require('cancellation-token');

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CancellationTokenSource {

  constructor() {
    this.canceled = false;
    this.token = new _cancellationToken2.default();
    this.linkedTokens = [];
  }

  cancel() {
    this.canceled = true;
    this._propagateToCancellationToken(this.token);
    if (this.linkedTokens && this.linkedTokens.length > 0) {
      for (var linkedToken in this.linkedTokens) {
        this._propagateToCancellationToken(linkedToken);
      }
    }
  }

  cancelAfter(delay) {
    setTimeout(() => {
      this.cancel();
    }, delay);
  }

  _propagateToCancellationToken(cancellationToken) {
    if (cancellationToken) {
      cancellationToken.canceled = true;
      if (cancellationToken.waitHandle) {
        cancellationToken.waitHandle();
      }
    }
  }

  static createLinkedCancellationTokenSource(linkedTokens) {
    var cancellationTokenSource = new CancellationTokenSource(linkedTokens);
    if (linkedTokens) {
      if (linkedTokens instanceof Array) {
        linkedTokens.forEach(linkedToken => {
          cancellationTokenSource.linkedTokens.push(linkedToken);
        });
      } else {
        cancellationTokenSource.linkedTokens.push(linkedTokens);
      }
    }
    return cancellationTokenSource;
  }

}
exports.default = CancellationTokenSource;

},{"cancellation-token":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class CancellationToken {

  constructor(canceled = false) {
    this.canceled = canceled;
    this.WaitHandle = null;
  }

  register(waitHandle) {
    this.waitHandle = waitHandle;
  }

  throwIfCanceled() {
    if (this.canceled) {
      throw {
        message: "Operation has been canceled"
      };
    }
  }
}

exports.default = CancellationToken;
CancellationToken.none = new CancellationToken();

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mediaTypeFormatter = require('media-type-formatter');

var _mediaTypeFormatter2 = _interopRequireDefault(_mediaTypeFormatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class JsonMediaTypeFormatter extends _mediaTypeFormatter2.default {

  constructor(options) {
    super(options);
    this.mediaTypes.push('application/json');
    this.defaultMediaType = 'application/json';
  }

  read(text, objectType) {
    if (text) {
      var value = JSON.parse(text);
      if (objectType) {
        if (value instanceof Array) {
          var array = [];
          value.forEach(item => {
            array.push(new objectType(item));
          });
          return array;
        } else {
          value = new objectType(value);
        }
      }
      return value;
    }
    return null;
  }

  write(value) {
    if (value) {
      return JSON.stringify(value);
    }
    return null;
  }
}
exports.default = JsonMediaTypeFormatter;

},{"media-type-formatter":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require("options");

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MediaTypeFormatter {

  constructor(options) {
    this.mediaTypes = [];
    this.defaultMediaType = null;
    _options2.default.extend(this, options);
  }

  canReadType(objectType) {
    return true;
  }

  carWriteType(objectType) {
    return true;
  }

  read(content, objectType) {
    throw new {
      message: "Method 'read' is not supported for class 'MediaTypeFormatter'"
    }();
  }

  write(value) {
    throw new {
      message: "Method 'write' is not supported for class 'MediaTypeFormatter'"
    }();
  }

}
exports.default = MediaTypeFormatter;

},{"options":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class Options {

  static extend(target, options) {
    if (target && options) {
      for (var propertyName in options) {
        if (propertyName in target) {
          target[propertyName] = options[propertyName];
        }
      }
    }
  }

}
exports.default = Options;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

var _cancellationToken = require('cancellation-token');

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class QueryBase {

  constructor(options) {
    this.client = null;
    this.method = 'GET';
    this.path = '/';
    this.headers = {};
    this.content = null;
    this.parameters = {};
    this.timeout = 0;
    _options2.default.extend(this, options);
  }

  setMethod(value) {
    if (!value) {
      throw {
        message: "Parameter 'value' is not passed to the method 'setMethod'"
      };
    }
    this.method = value;
    return this;
  }

  setPath(value) {
    if (!value) {
      throw {
        message: "Parameter 'value' is not passed to the method 'setPath'"
      };
    }
    this.path = value;
    return this;
  }

  setHeader(name, value) {
    if (!name) {
      throw {
        message: "Parameter 'name' is not passed to method 'setHeader'"
      };
    }
    this.headers[name] = value;
    return this;
  }

  setContent(value) {
    this.content = value;
    return this;
  }

  setParameter(name, value) {
    if (!name) {
      throw {
        message: "Parameter 'name' is not passed to method 'setParameter'"
      };
    }
    this.parameters[name] = value;
    return this;
  }

  setParameters(parameters) {
    if (parameters) {
      for (var parameterName in parameters) {
        this.setParameter(parameterName, parameters[parameterName]);
      }
    }
    return this;
  }

  setTimeout(value) {
    this.timeout = value;
    return this;
  }

  execute(cancellationToken = _cancellationToken2.default.none) {
    return new Promise((resolve, reject) => {
      var queryTranslator = null;
      if (this.client && this.client.services) {
        queryTranslator = this.client.services.queryTranslator;
      }
      if (queryTranslator) {
        this.client.send(queryTranslator.translate(this), cancellationToken).then(resolve).catch(reject);
      } else {
        reject({
          message: "Query translator is undefined"
        });
      }
    });
  }

  get() {
    return this.setMethod('GET');
  }

  save() {
    return this.setMethod('POST');
  }

  update() {
    return this.setMethod('PUT');
  }

  patch() {
    return this.setMethod('PATCH');
  }

  del() {
    return this.setMethod('DELETE');
  }

}
exports.default = QueryBase;

},{"cancellation-token":4,"options":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _query = require('query');

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class QueryFactory {

  create(options) {
    return new _query2.default(options);
  }

}
exports.default = QueryFactory;

},{"query":11}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _restRequestMessage = require("rest-request-message");

var _restRequestMessage2 = _interopRequireDefault(_restRequestMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class QueryTranslator {

  constructor() {}

  translate(query) {
    var requestMessage = null;
    if (query) {
      // TODO: route has to build here
      requestMessage = new _restRequestMessage2.default({
        method: query.method,
        path: query.path,
        headers: query.headers,
        content: query.content,
        timeout: query.timeout
      });
    } else {
      throw {
        message: "Parameter 'query' is not passed to the method 'translate'"
      };
    }
    return requestMessage;
  }

}
exports.default = QueryTranslator;

},{"rest-request-message":16}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _queryBase = require('query-base');

var _queryBase2 = _interopRequireDefault(_queryBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Query extends _queryBase2.default {

  constructor(options) {
    super(options);
  }

  skip(value) {
    return this.setParameter('skip', value);
  }

  take(value) {
    return this.setParameter('take', value);
  }

}
exports.default = Query;

},{"query-base":8}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cancellationToken = require("cancellation-token");

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

var _options = require("options");

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Repository {

  constructor(options) {
    this.client = null;
    this.path = null;
    this.objectType = null;
    _options2.default.extend(this, options);
  }

  query() {
    var query = null;
    var queryFactory = null;
    if (this.client && this.client.services) {
      queryFactory = this.client.services.queryFactory;
    }
    if (queryFactory) {
      query = queryFactory.create({
        client: this.client,
        path: this.path
      });
    } else {
      throw {
        message: "Query factoy is undefined"
      };
    }
    return query;
  }

  get(parameters, cancellationToken = _cancellationToken2.default.none) {
    return new Promise((resolve, reject) => {
      try {
        this.query({
          client: this.client,
          path: this.path
        }).get().setParameters(parameters).execute(cancellationToken).then(responseMessage => {
          if (responseMessage.status >= 200 && responseMessage.status < 300) {
            resolve(responseMessage.content);
          } else {
            if (responseMessage.content) {
              reject(responseMessage.content);
            } else {
              reject({
                message: responseMessage.statusText
              });
            }
          }
        }).catch(ex => reject(ex));
      } catch (ex) {
        reject(ex);
      }
    });
    // if (!BatchExecutionContext.current) {
    //   return this.client.send(requestMessage);
    // } else {
    //   var context = BatchExecutionContext.current;
    //   if (!context.client) {
    //     context.client = this.client;
    //   } else if (context.client == this.client) {
    //     context.requestMessages.push(requestMessage);
    //   } else {
    //     // TODO: review error message
    //     throw {
    //       message: "All operation has to use same rest client"
    //     };
    //   }
    //   // TODO: bla bla bla
    //   // return promise...
    // }
  }

  save(parameters, value, cancellationToken = _cancellationToken2.default.none) {
    throw {
      message: "Not implemented"
    };
  }

  update(parameters, value, cancellationToken = _cancellationToken2.default.none) {
    throw {
      message: "Not implemented"
    };
  }

  patch(parameters, value, cancellationToken = _cancellationToken2.default.none) {
    throw {
      message: "Not implemented"
    };
  }

  del(parameters, value, cancellationToken = _cancellationToken2.default.none) {
    throw {
      message: "Not implemented"
    };
  }

}
exports.default = Repository;

},{"cancellation-token":4,"options":7}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

var _restRequestMessage = require('rest-request-message');

var _restRequestMessage2 = _interopRequireDefault(_restRequestMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RestBulkRequestMessage {

  constructor(options) {
    this.method = null;
    this.path = null;
    this.headers = null;
    this.timeout = null;
    this.requestMessages = [];
    _options2.default.extend(this, options);
  }

  add(message) {
    if (message && message instanceof _restRequestMessage2.default) {
      if (this.requestMessages) {
        this.requestMessages.push(message);
      }
    } else {
      throw {
        message: "Message is undefined or it's type is invalid"
      };
    }
    return this;
  }

}
exports.default = RestBulkRequestMessage;

},{"options":7,"rest-request-message":16}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RestBulkResponseMessage {

  constructor() {
    this.status = null;
    this.statusText = null;
    this.headers = null;
    this.responseMessages = [];
    _options2.default.extend(this, options);
  }

}
exports.default = RestBulkResponseMessage;

},{"options":7}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

var _cancellationToken = require('cancellation-token');

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

var _restRequestMessage = require('rest-request-message');

var _restRequestMessage2 = _interopRequireDefault(_restRequestMessage);

var _restResponseMessage = require('rest-response-message');

var _restResponseMessage2 = _interopRequireDefault(_restResponseMessage);

var _restBulkRequestMessage = require('rest-bulk-request-message');

var _restBulkRequestMessage2 = _interopRequireDefault(_restBulkRequestMessage);

var _restBulkResponseMessage = require('rest-bulk-response-message');

var _restBulkResponseMessage2 = _interopRequireDefault(_restBulkResponseMessage);

var _jsonMediaTypeFormatter = require('json-media-type-formatter');

var _jsonMediaTypeFormatter2 = _interopRequireDefault(_jsonMediaTypeFormatter);

var _queryFactory = require('query-factory');

var _queryFactory2 = _interopRequireDefault(_queryFactory);

var _queryTranslator = require('query-translator');

var _queryTranslator2 = _interopRequireDefault(_queryTranslator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DONE = 4;

class RestClient {

  constructor(options) {
    this.protocol = 'http';
    this.host = 'localhost';
    this.port = 80;
    this.timeout = 30;
    this.mediaTypeFormatters = [new _jsonMediaTypeFormatter2.default()];
    this.services = {
      queryFactory: new _queryFactory2.default(),
      queryTranslator: new _queryTranslator2.default()
    };
    this.interceptors = [];
    _options2.default.extend(this, options);
  }

  send(requestMessage, cancellationToken = _cancellationToken2.default.none) {
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
        if (requestMessage && requestMessage instanceof _restRequestMessage2.default) {
          this._sendMessage(requestMessage, httpRequest, resolve, reject);
        } else if (requestMessage && requestMessage instanceof _restBulkRequestMessage2.default) {
          this._sendBulkMessage(requestMessage, httpRequest, resolve, reject);
        } else {
          throw {
            message: "Message is undefined or it's type is invalid"
          };
        }
      } catch (ex) {
        reject(ex);
      }
    });
  }

  _sendMessage(requestMessage, httpRequest, resolve, reject) {
    var url = '';
    if (this.protocol) {
      url += `${ this.protocol }://`;
    } else {
      url += 'http://';
    }
    if (this.host) {
      url += `${ this.host }`;
    } else {
      url += 'localhost';
    }
    if (this.port && this.port !== 80) {
      url += `:${ this.port }`;
    }
    if (!requestMessage.path.startsWith('/')) {
      requestMessage.path = '/' + requestMessage.path;
    }
    url += requestMessage.path;
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
          resolve(new _restResponseMessage2.default({
            status: httpRequest.status,
            statusText: httpRequest.statusText,
            headers: headers,
            content: content,
            contentType: contentType
          }));
        } else {
          reject({
            message: "Failed to connect to the server"
          });
        }
      }
    };
    httpRequest.send();
  }

  _sendBulkMessage(bulkRequestMessage, httpRequest, resolve, reject) {
    setTimeout(() => {
      resolve(new _restBulkResponseMessage2.default());
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
exports.default = RestClient;

},{"cancellation-token":4,"json-media-type-formatter":5,"options":7,"query-factory":9,"query-translator":10,"rest-bulk-request-message":13,"rest-bulk-response-message":14,"rest-request-message":16,"rest-response-message":17}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RestRequestMessage {

  constructor(options) {
    this.method = null;
    this.path = null;
    this.headers = null;
    this.accept = null;
    this.content = null;
    this.contentType = null;
    this.objectType = null;
    this.timeout = null;
    _options2.default.extend(this, options);
  }

}
exports.default = RestRequestMessage;

},{"options":7}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RestResponseMessage {

  constructor(options) {
    this.status = null;
    this.statusText = null;
    this.headers = null;
    this.content = null;
    this.contentType = null;
    _options2.default.extend(this, options);
  }

}
exports.default = RestResponseMessage;

},{"options":7}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryTranslator = exports.QueryFactory = exports.JsonMediaTypeFormatter = exports.MediaTypeFormatter = exports.Repository = exports.Query = exports.QueryBase = exports.Batch = exports.RestBulkResponseMessage = exports.RestBulkRequestMessage = exports.RestResponseMessage = exports.RestRequestMessage = exports.RestClient = exports.CancellationTokenSource = exports.CancellationToken = undefined;

var _cancellationToken = require('cancellation-token');

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

var _cancellationTokenSource = require('cancellation-token-source');

var _cancellationTokenSource2 = _interopRequireDefault(_cancellationTokenSource);

var _restClient = require('rest-client');

var _restClient2 = _interopRequireDefault(_restClient);

var _restRequestMessage = require('rest-request-message');

var _restRequestMessage2 = _interopRequireDefault(_restRequestMessage);

var _restResponseMessage = require('rest-response-message');

var _restResponseMessage2 = _interopRequireDefault(_restResponseMessage);

var _restBulkRequestMessage = require('rest-bulk-request-message');

var _restBulkRequestMessage2 = _interopRequireDefault(_restBulkRequestMessage);

var _restBulkResponseMessage = require('rest-bulk-response-message');

var _restBulkResponseMessage2 = _interopRequireDefault(_restBulkResponseMessage);

var _batch = require('batch');

var _batch2 = _interopRequireDefault(_batch);

var _queryBase = require('query-base');

var _queryBase2 = _interopRequireDefault(_queryBase);

var _query = require('query');

var _query2 = _interopRequireDefault(_query);

var _repository = require('repository');

var _repository2 = _interopRequireDefault(_repository);

var _mediaTypeFormatter = require('media-type-formatter');

var _mediaTypeFormatter2 = _interopRequireDefault(_mediaTypeFormatter);

var _jsonMediaTypeFormatter = require('json-media-type-formatter');

var _jsonMediaTypeFormatter2 = _interopRequireDefault(_jsonMediaTypeFormatter);

var _queryFactory = require('query-factory');

var _queryFactory2 = _interopRequireDefault(_queryFactory);

var _queryTranslator = require('query-translator');

var _queryTranslator2 = _interopRequireDefault(_queryTranslator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.CancellationToken = _cancellationToken2.default;
exports.CancellationTokenSource = _cancellationTokenSource2.default;
exports.RestClient = _restClient2.default;
exports.RestRequestMessage = _restRequestMessage2.default;
exports.RestResponseMessage = _restResponseMessage2.default;
exports.RestBulkRequestMessage = _restBulkRequestMessage2.default;
exports.RestBulkResponseMessage = _restBulkResponseMessage2.default;
exports.Batch = _batch2.default;
exports.QueryBase = _queryBase2.default;
exports.Query = _query2.default;
exports.Repository = _repository2.default;
exports.MediaTypeFormatter = _mediaTypeFormatter2.default;
exports.JsonMediaTypeFormatter = _jsonMediaTypeFormatter2.default;
exports.QueryFactory = _queryFactory2.default;
exports.QueryTranslator = _queryTranslator2.default;

},{"batch":2,"cancellation-token":4,"cancellation-token-source":3,"json-media-type-formatter":5,"media-type-formatter":6,"query":11,"query-base":8,"query-factory":9,"query-translator":10,"repository":12,"rest-bulk-request-message":13,"rest-bulk-response-message":14,"rest-client":15,"rest-request-message":16,"rest-response-message":17}]},{},[18])(18)
});


//# sourceMappingURL=rest.js.map
