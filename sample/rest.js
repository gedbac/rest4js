(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rest = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cancellationToken = require('cancellation-token');

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

var _restMessageInterceptorBase = require('rest-message-interceptor-base');

var _restMessageInterceptorBase2 = _interopRequireDefault(_restMessageInterceptorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BasicAuthentication extends _restMessageInterceptorBase2.default {

  constructor(options) {
    super(options);
  }

  beforeSend(requestMessage, context, cancellationToken = _cancellationToken2.default.none) {
    return new Promise((resolve, reject) => {
      if (context && context.client) {
        var username = context.client.username;
        var password = context.client.password;
        if (username && password) {
          requestMessage.headers['Authorization'] = `Basic ${ btoa(username + ':' + password) }`;
        }
        resolve(requestMessage);
      }
    });
  }

}
exports.default = BasicAuthentication;

},{"cancellation-token":5,"rest-message-interceptor-base":22}],2:[function(require,module,exports){
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
    _options2.default.assign(this, options);
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

},{"options":9}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cancellationToken = require('cancellation-token');

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

var _batchExecutionContext = require('batch-execution-context');

var _batchExecutionContext2 = _interopRequireDefault(_batchExecutionContext);

var _restClientError = require('rest-client-error');

var _restClientError2 = _interopRequireDefault(_restClientError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Batch {

  constructor() {
    this._operations = [];
  }

  add(operation) {
    if (operation && typeof operation === 'function') {
      this._operations.push(operation);
    } else {
      throw new _restClientError2.default({
        message: "Operation is not defined or it's type is invalid"
      });
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

},{"batch-execution-context":2,"cancellation-token":5,"rest-client-error":17}],4:[function(require,module,exports){
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

},{"cancellation-token":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _restClientError = require("rest-client-error");

var _restClientError2 = _interopRequireDefault(_restClientError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      throw new _restClientError2.default({
        message: "Operation has been canceled"
      });
    }
  }
}

exports.default = CancellationToken;
CancellationToken.none = new CancellationToken();

},{"rest-client-error":17}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

var _mediaTypeFormatterBase = require('media-type-formatter-base');

var _mediaTypeFormatterBase2 = _interopRequireDefault(_mediaTypeFormatterBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class JsonMediaTypeFormatter extends _mediaTypeFormatterBase2.default {

  constructor(options) {
    super();
    this.indent = 0;
    this.mediaTypes.push('application/json');
    this.defaultMediaType = 'application/json';
    _options2.default.assign(this, options);
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
      return JSON.stringify(value, null, this.indent);
    }
    return null;
  }
}
exports.default = JsonMediaTypeFormatter;

},{"media-type-formatter-base":7,"options":9}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

var _restClientError = require('rest-client-error');

var _restClientError2 = _interopRequireDefault(_restClientError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MediaTypeFormatterBase {

  constructor(options) {
    this.mediaTypes = [];
    this.defaultMediaType = null;
    _options2.default.assign(this, options);
  }

  read(content, objectType) {
    throw new _restClientError2.default({
      message: "Method 'read' is not supported for class 'MediaTypeFormatterBase'"
    });
  }

  write(value) {
    throw new _restClientError2.default({
      message: "Method 'write' is not supported for class 'MediaTypeFormatterBase'"
    });
  }

}
exports.default = MediaTypeFormatterBase;

},{"options":9,"rest-client-error":17}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cancellationToken = require('cancellation-token');

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

var _restMessageInterceptorBase = require('rest-message-interceptor-base');

var _restMessageInterceptorBase2 = _interopRequireDefault(_restMessageInterceptorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NoCaching extends _restMessageInterceptorBase2.default {

  constructor(options) {
    super(options);
  }

  beforeSend(requestMessage, context, cancellationToken = _cancellationToken2.default.none) {
    return new Promise((resolve, reject) => {
      requestMessage.headers['Cache-Control'] = 'no-cache';
      resolve(requestMessage);
    });
  }

}
exports.default = NoCaching;

},{"cancellation-token":5,"rest-message-interceptor-base":22}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class Options {

  static assign(target, options) {
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

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

var _cancellationToken = require('cancellation-token');

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

var _restClientError = require('rest-client-error');

var _restClientError2 = _interopRequireDefault(_restClientError);

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
    _options2.default.assign(this, options);
  }

  setMethod(value) {
    if (!value) {
      throw new _restClientError2.default({
        message: "Parameter 'value' is not passed to the method 'setMethod'"
      });
    }
    this.method = value;
    return this;
  }

  setPath(value) {
    if (!value) {
      throw new _restClientError2.default({
        message: "Parameter 'value' is not passed to the method 'setPath'"
      });
    }
    this.path = value;
    return this;
  }

  setHeader(name, value) {
    if (!name) {
      throw new _restClientError2.default({
        message: "Parameter 'name' is not passed to method 'setHeader'"
      });
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
      throw new _restClientError2.default({
        message: "Parameter 'name' is not passed to method 'setParameter'"
      });
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
        reject(new _restClientError2.default({
          message: "Query translator is undefined"
        }));
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

},{"cancellation-token":5,"options":9,"rest-client-error":17}],11:[function(require,module,exports){
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

},{"query":13}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _restRequestMessage = require('rest-request-message');

var _restRequestMessage2 = _interopRequireDefault(_restRequestMessage);

var _restClientError = require('rest-client-error');

var _restClientError2 = _interopRequireDefault(_restClientError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class QueryTranslator {

  constructor() {
    this._parameterNameCache = {};
  }

  translate(query) {
    var requestMessage = null;
    if (query) {
      requestMessage = new _restRequestMessage2.default({
        method: query.method,
        path: this.getPath(query),
        queryString: this.getQueryString(query),
        headers: query.headers,
        content: query.content,
        timeout: query.timeout
      });
    } else {
      throw new _restClientError2.default({
        message: "Parameter 'query' is not passed to the method 'translate'"
      });
    }
    return requestMessage;
  }

  getPath(query) {
    var path = null;
    if (query) {
      path = query.path;
      var parameterNames = this.getParameterNames(query.path);
      if (parameterNames && parameterNames.length > 0) {
        parameterNames.forEach(parameterName => {
          if (query.parameters) {
            if (parameterName in query.parameters) {
              path = path.replace(`{${ parameterName }}`, query.parameters[parameterName]);
            } else {
              path = path.replace(`/{${ parameterName }}`, '');
            }
          }
        });
      }
    }
    return path;
  }

  getQueryString(query) {
    var queryString = '';
    if (query && query.parameters) {
      var pathParameterNames = this.getParameterNames(query.path);
      for (var parameterName in query.parameters) {
        if (!pathParameterNames || pathParameterNames.indexOf(parameterName) === -1) {
          if (query.parameters[parameterName] !== null && query.parameters[parameterName] !== undefined) {
            if (queryString) {
              queryString += '&';
            }
            queryString += `${ parameterName }=${ query.parameters[parameterName] }`;
          }
        }
      }
    }
    return queryString;
  }

  getParameterNames(path) {
    var names = null;
    if (path) {
      var result = path.match(/\{(.*?)\}/g);
      if (result && result.length > 0) {
        names = [];
        result.forEach(text => {
          names.push(text.substring(1, text.length - 1));
        });
      }
    }
    return names;
  }

}
exports.default = QueryTranslator;

},{"rest-client-error":17,"rest-request-message":23}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

var _queryBase = require('query-base');

var _queryBase2 = _interopRequireDefault(_queryBase);

var _sortDirection = require('sort-direction');

var _sortDirection2 = _interopRequireDefault(_sortDirection);

var _restClientError = require('rest-client-error');

var _restClientError2 = _interopRequireDefault(_restClientError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Query extends _queryBase2.default {

  constructor(options) {
    super();
    this.sorting = null;
    this.transformation = null;
    _options2.default.assign(this, options);
  }

  fields(fields) {
    return this.setParameter('fields', fields);
  }

  sortBy(field) {
    if (field) {
      if (!this.sorting) {
        this.sorting = [];
        this.sorting.push({
          field: field,
          direction: _sortDirection2.default.Acs
        });
      } else {
        throw new _restClientError2.default({
          message: "Sorting is already defined"
        });
      }
    } else {
      throw new _restClientError2.default({
        message: "Parameter 'field' is not passed to the method 'sortBy'"
      });
    }
    return this;
  }

  sortByDescending(field) {
    if (field) {
      if (!this.sorting) {
        this.sorting = [];
        this.sorting.push({
          field: field,
          direction: _sortDirection2.default.Desc
        });
      } else {
        throw new _restClientError2.default({
          message: "Sorting is already defined"
        });
      }
    } else {
      throw new _restClientError2.default({
        message: "Parameter 'field' is not passed to the method 'sortByDescending'"
      });
    }
    return this;
  }

  thenBy(field) {
    if (field) {
      if (this.sorting) {
        this.sorting.push({
          field: field,
          direction: _sortDirection2.default.Asc
        });
      } else {
        throw new _restClientError2.default({
          message: "Sorting is not defined"
        });
      }
    } else {
      throw new _restClientError2.default({
        message: "Parameter 'field' is not passed to the method 'thenBy'"
      });
    }
    return this;
  }

  thenByDescending(field) {
    if (field) {
      if (this.sorting) {
        this.sorting.push({
          field: field,
          direction: _sortDirection2.default.Desc
        });
      } else {
        throw new _restClientError2.default({
          message: "Sorting is not defined"
        });
      }
    } else {
      throw new _restClientError2.default({
        message: "Parameter 'field' is not passed to the method 'thenByDescending'"
      });
    }
    return this;
  }

  skip(value) {
    return this.setParameter('skip', value);
  }

  limit(value) {
    return this.setParameter('limit', value);
  }

  transform(func) {
    if (func) {
      if (typeof func === "function") {
        this.transformation = func;
      } else {
        throw new _restClientError2.default({
          message: "Parameter 'func' passed to the method 'transform' has to be a function"
        });
      }
    } else {
      throw new _restClientError2.default({
        message: "Parameter 'func' is not passed to the method 'transform'"
      });
    }
    return this;
  }

}
exports.default = Query;

},{"options":9,"query-base":10,"rest-client-error":17,"sort-direction":27}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cancellationToken = require('cancellation-token');

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

var _restClientError = require('rest-client-error');

var _restClientError2 = _interopRequireDefault(_restClientError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Repository {

  constructor(options) {
    this.client = null;
    this.path = null;
    this.objectType = null;
    _options2.default.assign(this, options);
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
      throw new _restClientError2.default({
        message: "Query factoy is undefined"
      });
    }
    return query;
  }

  get(parameters, cancellationToken = _cancellationToken2.default.none) {
    return new Promise((resolve, reject) => {
      try {
        this.query().get().setParameters(parameters).execute(cancellationToken).then(responseMessage => {
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
    return new Promise((resolve, reject) => {
      return this.query().save().setParameters(parameters).setContent(value).execute(cancellationToken).then(responseMessage => {
        if (responseMessage.status >= 200 && responseMessage.status < 300) {
          // TODO: if content, otherwise take id from location header and set id
          resolve(responseMessage.content);
        } else {
          if (responseMessage.content) {
            reject(responseMessage.content);
          } else {
            reject(new _restClientError2.default({
              message: responseMessage.statusText
            }));
          }
        }
      }).catch(ex => reject(ex));
    });
  }

  update(parameters, value, cancellationToken = _cancellationToken2.default.none) {
    return new Promise((resolve, reject) => {
      this.query().update().setParameters(parameters).setContent(value).execute(cancellationToken).then(responseMessage => {
        if (responseMessage.status >= 200 && responseMessage.status < 300) {
          resolve(responseMessage.content);
        } else {
          if (responseMessage.content) {
            reject(responseMessage.content);
          } else {
            reject(new _restClientError2.default({
              message: responseMessage.statusText
            }));
          }
        }
      }).catch(ex => reject(ex));
    });
  }

  patch(parameters, value, cancellationToken = _cancellationToken2.default.none) {
    return new Promise((resolve, reject) => {
      this.query().patch().setParameters(parameters).setContent(value).execute(cancellationToken).then(responseMessage => {
        if (responseMessage.status >= 200 && responseMessage.status < 300) {
          resolve(responseMessage.content);
        } else {
          if (responseMessage.content) {
            reject(responseMessage.content);
          } else {
            reject(new _restClientError2.default({
              message: responseMessage.statusText
            }));
          }
        }
      }).catch(ex => reject(ex));
    });
  }

  del(parameters, cancellationToken = _cancellationToken2.default.none) {
    return new Promise((resolve, reject) => {
      this.query().del().setParameters(parameters).execute(cancellationToken).then(responseMessage => {
        if (responseMessage.status >= 200 && responseMessage.status < 300) {
          resolve(responseMessage.content);
        } else {
          if (responseMessage.content) {
            reject(responseMessage.content);
          } else {
            reject(new _restClientError2.default({
              message: responseMessage.statusText
            }));
          }
        }
      }).catch(ex => reject(ex));
    });
  }

}
exports.default = Repository;

},{"cancellation-token":5,"options":9,"rest-client-error":17}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

var _restRequestMessage = require('rest-request-message');

var _restRequestMessage2 = _interopRequireDefault(_restRequestMessage);

var _restClientError = require('rest-client-error');

var _restClientError2 = _interopRequireDefault(_restClientError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RestBulkRequestMessage {

  constructor(options) {
    this.method = 'POST';
    this.path = null;
    this.queryString = null;
    this.headers = {};
    this.timeout = null;
    this.requestMessages = [];
    _options2.default.assign(this, options);
  }

  add(message) {
    if (message && message instanceof _restRequestMessage2.default) {
      if (this.requestMessages) {
        this.requestMessages.push(message);
      }
    } else {
      throw new _restClientError2.default({
        message: "Message is undefined or it's type is invalid"
      });
    }
    return this;
  }

}
exports.default = RestBulkRequestMessage;

},{"options":9,"rest-client-error":17,"rest-request-message":23}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RestBulkResponseMessage {

  constructor(options) {
    this.requestMessage = null;
    this.status = null;
    this.statusText = null;
    this.headers = {};
    this.responseMessages = [];
    _options2.default.assign(this, options);
  }

}
exports.default = RestBulkResponseMessage;

},{"options":9}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RestClientError {

  constructor(options) {
    this.name = 'RestClientError';
    this.stack = null;
    this.message = "A rest error has occurred.";
    var lines, i, tmp;
    if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Chrome') !== -1 || typeof navigator === 'undefined') {
      lines = new Error().stack.split('\n');
      if (lines && lines.length > 2) {
        tmp = [];
        for (i = 2; i < lines.length; i++) {
          if (lines[i]) {
            tmp.push(lines[i].trim());
          }
        }
        this.stack = tmp.join('\n');
      }
    } else if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Firefox') !== -1) {
      lines = new Error().stack.split('\n');
      if (lines && lines.length > 1) {
        tmp = [];
        for (i = 1; i < lines.length; i++) {
          if (lines[i]) {
            tmp.push('at ' + lines[i].trim().replace('@', ' (') + ')');
          }
        }
        this.stack = tmp.join('\n');
      }
    } else if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Trident') !== -1) {
      try {
        throw new Error();
      } catch (error) {
        if ('stack' in error) {
          lines = error.stack.split('\n');
          if (lines && lines.length > 2) {
            tmp = [];
            for (i = 2; i < lines.length; i++) {
              if (lines[i]) {
                tmp.push(lines[i].trim());
              }
            }
            this.stack = tmp.join('\n');
          }
        } else {
          this.stack = '';
        }
      }
    } else {
      var error = new Error();
      if ('stack' in error) {
        this.stack = error.stack;
      } else {
        this.stack = '';
      }
    }
    _options2.default.assign(this, options);
  }

  toString() {
    var text = this.name + ': ' + this.message;
    if (this.stack) {
      text += '\n\t' + this.stack.replace(/\n/g, '\n\t');
    }
    return text;
  }

}
exports.default = RestClientError;

},{"options":9}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

var _cancellationToken = require('cancellation-token');

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

var _restClientError = require('rest-client-error');

var _restClientError2 = _interopRequireDefault(_restClientError);

var _restMessageContext = require('rest-message-context');

var _restMessageContext2 = _interopRequireDefault(_restMessageContext);

var _restBulkResponseMessage = require('rest-bulk-response-message');

var _restBulkResponseMessage2 = _interopRequireDefault(_restBulkResponseMessage);

var _mediaTypeFormatterBase = require('media-type-formatter-base');

var _mediaTypeFormatterBase2 = _interopRequireDefault(_mediaTypeFormatterBase);

var _jsonMediaTypeFormatter = require('json-media-type-formatter');

var _jsonMediaTypeFormatter2 = _interopRequireDefault(_jsonMediaTypeFormatter);

var _restMessageHandlerBase = require('rest-message-handler-base');

var _restMessageHandlerBase2 = _interopRequireDefault(_restMessageHandlerBase);

var _restMessageHandler = require('rest-message-handler');

var _restMessageHandler2 = _interopRequireDefault(_restMessageHandler);

var _noCaching = require('no-caching');

var _noCaching2 = _interopRequireDefault(_noCaching);

var _basicAuthentication = require('basic-authentication');

var _basicAuthentication2 = _interopRequireDefault(_basicAuthentication);

var _queryFactory = require('query-factory');

var _queryFactory2 = _interopRequireDefault(_queryFactory);

var _queryTranslator = require('query-translator');

var _queryTranslator2 = _interopRequireDefault(_queryTranslator);

var _urlBuilder = require('url-builder');

var _urlBuilder2 = _interopRequireDefault(_urlBuilder);

var _retryPolicy = require('retry-policy');

var _retryPolicy2 = _interopRequireDefault(_retryPolicy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RestClient {

  constructor(options) {
    this.scheme = 'http';
    this.host = 'localhost';
    this.port = 80;
    this.timeout = 30;
    this.username = null;
    this.password = null;
    this.defaultContentType = 'application/json';
    this.retryPolicy = new _retryPolicy2.default();
    this.mediaTypeFormatters = [new _jsonMediaTypeFormatter2.default()];
    this.messageHandlers = [new _restMessageHandler2.default()];
    this.services = {
      queryFactory: new _queryFactory2.default(),
      queryTranslator: new _queryTranslator2.default()
    };
    this.messageInterceptors = [new _noCaching2.default(), new _basicAuthentication2.default()];
    _options2.default.assign(this, options);
  }

  send(requestMessage, cancellationToken = _cancellationToken2.default.none) {
    return new Promise((resolve, reject) => {
      try {
        cancellationToken.throwIfCanceled();
        if (!requestMessage) {
          throw new _restClientError2.default({
            message: "Parameter 'requestMessage' is not passed to the method 'send' of class 'RestClient'"
          });
        }
        var messageHandler = this.getMessageHandler(requestMessage);
        if (!messageHandler) {
          throw new _restClientError2.default({
            message: `Message handler is not defined for request message of type '${ requestMessage.constructor.name }'`
          });
        }
        var context = new _restMessageContext2.default({
          client: this
        });
        messageHandler.send(requestMessage, context, cancellationToken).then(resolve, reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  use(value) {
    if (value) {
      if (value instanceof _mediaTypeFormatterBase2.default) {
        this.mediaTypeFormatters.push(value);
      } else if (value instanceof _restMessageHandlerBase2.default) {
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
        if (this.messageHandlers[i].messageTypes && this.messageHandlers[i].messageTypes instanceof Array && this.messageHandlers[i].messageTypes.indexOf(requestMessage.constructor) !== -1) {
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
        if (this.mediaTypeFormatters[i].mediaTypes && this.mediaTypeFormatters[i].mediaTypes instanceof Array && this.mediaTypeFormatters[i].mediaTypes.indexOf(contentType) !== -1) {
          mediaTypeFormatter = this.mediaTypeFormatters[i];
          break;
        }
      }
    }
    return mediaTypeFormatter;
  }

  _sendBulkMessage(bulkRequestMessage, httpRequest, resolve, reject) {
    if (!bulkRequestMessage.method) {
      throw new _restClientError2.default({
        message: "Request doesn't have method defined"
      });
    }
    var url = new _urlBuilder2.default({
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
      httpRequest.setRequestHeader('Content-Type', `multipart/mixed; boundary="${ boundary }"`);
      bulkRequestMessage.requestMessages.forEach(requestMessage => {
        content = this._appendRequestMessageToContent(requestMessage, content, boundary);
      });
      content += `--${ boundary }--`;
      httpRequest.send(content);
    } else {
      httpRequest.send();
    }
  }

  _appendRequestMessageToContent(requestMessage, output, boundary) {
    if (!requestMessage.method) {
      throw new _restClientError2.default({
        message: "Request doesn't have method defined"
      });
    }
    if (!requestMessage.path) {
      throw new _restClientError2.default({
        message: "Request doesn't have path defined"
      });
    }
    output += `--${ boundary }\r\n`;
    output += 'application/http; msgtype=request\r\n\r\n';
    output += `${ requestMessage.method } ${ requestMessage.path } HTTP/1.1\r\n`;
    if (requestMessage.headers) {
      for (var headerName in requestMessage.headers) {
        output += `${ headerName }: ${ requestMessage.headers[headerName] }`;
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
      output += `Content-Type: ${ contentType }`;
      output += content;
    }
    return output;
  }

  _onReceiveBulkMessage(bulkRequestMessage, httpRequest, resolve, reject) {
    // TODO: not implemented
    resolve(new _restBulkResponseMessage2.default({
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
exports.default = RestClient;

},{"basic-authentication":1,"cancellation-token":5,"json-media-type-formatter":6,"media-type-formatter-base":7,"no-caching":8,"options":9,"query-factory":11,"query-translator":12,"rest-bulk-response-message":16,"rest-client-error":17,"rest-message-context":19,"rest-message-handler":21,"rest-message-handler-base":20,"retry-policy":26,"url-builder":28}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RestMessageContext {

  constructor(options) {
    this.client = null;
    this.items = {};
    _options2.default.assign(this, options);
  }

}
exports.default = RestMessageContext;

},{"options":9}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

var _cancellationToken = require('cancellation-token');

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

var _restClientError = require('rest-client-error');

var _restClientError2 = _interopRequireDefault(_restClientError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RestMessageHandlerBase {

  constructor(options) {
    this.messageTypes = [];
    _options2.default.assign(this, options);
  }

  send(requestMessage, context, cancellationToken = _cancellationToken2.default.none) {
    throw new _restClientError2.default({
      message: "Method 'send' is not supported for class 'RestMessageHandlerBase'"
    });
  }

}
exports.default = RestMessageHandlerBase;

},{"cancellation-token":5,"options":9,"rest-client-error":17}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

var _cancellationToken = require('cancellation-token');

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

var _restMessageHandlerBase = require('rest-message-handler-base');

var _restMessageHandlerBase2 = _interopRequireDefault(_restMessageHandlerBase);

var _restClientError = require('rest-client-error');

var _restClientError2 = _interopRequireDefault(_restClientError);

var _urlBuilder = require('url-builder');

var _urlBuilder2 = _interopRequireDefault(_urlBuilder);

var _restRequestMessage = require('rest-request-message');

var _restRequestMessage2 = _interopRequireDefault(_restRequestMessage);

var _restResponseMessage = require('rest-response-message');

var _restResponseMessage2 = _interopRequireDefault(_restResponseMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RestMessageHandler extends _restMessageHandlerBase2.default {

  constructor(options) {
    super();
    this.messageTypes.push(_restRequestMessage2.default);
    _options2.default.assign(this, options);
  }

  send(requestMessage, context, cancellationToken = _cancellationToken2.default.none) {
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
          throw new _restClientError2.default({
            message: "Parameter 'requestMessage' is not passed to the method 'send' of class 'RestMessageHandler'"
          });
        }
        if (!requestMessage.method) {
          throw new _restClientError2.default({
            message: "Method is not defined in request message"
          });
        }
        if (!context) {
          throw new _restClientError2.default({
            message: "Parameter 'context' is not passed to the method 'send' of class 'RestMessageHandler'"
          });
        }
        if (!context.client) {
          throw new _restClientError2.default({
            message: "Rest client is not define in context"
          });
        }
        var client = context.client;
        var url = new _urlBuilder2.default({
          scheme: client.scheme,
          host: client.host,
          port: client.port,
          path: requestMessage.path,
          queryString: requestMessage.queryString
        }).toString();
        httpRequest = new XMLHttpRequest();
        httpRequest.open(requestMessage.method, url, true);
        httpRequest.onreadystatechange = () => {
          if (httpRequest && httpRequest.readyState === 4) {
            this._onReceive(requestMessage, httpRequest, context).then(responseMessage => {
              return this._onAfterReceive(responseMessage, context, cancellationToken);
            }).then(responseMessage => {
              resolve(responseMessage);
            }).catch(reason => {
              reject(reason);
            });
          }
        };
        this._onBeforeSend(requestMessage, context, cancellationToken).then(() => {
          return this._onSend(requestMessage, httpRequest, context);
        }).catch(reason => {
          reject(reason);
        });
      } catch (error) {
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

  _onSend(requestMessage, httpRequest, context) {
    return new Promise((resolve, reject) => {
      try {
        httpRequest.timeout = context.client.timeout;
        if ('timeout' in requestMessage && requestMessage.timeout > 0) {
          httpRequest.timeout = requestMessage.timeout;
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
          requestMessage['Content-Type'] = contentType;
        }
        this._setRequestHeaders(requestMessage, httpRequest, context);
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

  _onReceive(requestMessage, httpRequest, context) {
    return new Promise((resolve, reject) => {
      if (httpRequest.status !== 0) {
        var responseMessage = new _restResponseMessage2.default({
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
        reject(new _restClientError2.default({
          message: "Failed to connect to the server"
        }));
      }
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

}
exports.default = RestMessageHandler;

},{"cancellation-token":5,"options":9,"rest-client-error":17,"rest-message-handler-base":20,"rest-request-message":23,"rest-response-message":24,"url-builder":28}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

var _cancellationToken = require('cancellation-token');

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RestMessageInterceptorBase {

  constructor(options) {
    _options2.default.assign(this, options);
  }

  beforeSend(requestMessage, context, cancellationToken = _cancellationToken2.default.none) {
    return Promise.resolve(requestMessage);
  }

  afterReceive(responseMessage, context, cancellationToken = _cancellationToken2.default.none) {
    return Promise.resolve(responseMessage);
  }

}
exports.default = RestMessageInterceptorBase;

},{"cancellation-token":5,"options":9}],23:[function(require,module,exports){
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
    this.queryString = null;
    this.headers = {};
    this.accept = null;
    this.content = null;
    this.contentType = null;
    this.objectType = null;
    this.timeout = null;
    _options2.default.assign(this, options);
  }

}
exports.default = RestRequestMessage;

},{"options":9}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RestResponseMessage {

  constructor(options) {
    this.requestMessage = null;
    this.status = null;
    this.statusText = null;
    this.headers = {};
    this.content = null;
    this.contentType = null;
    _options2.default.assign(this, options);
  }

}
exports.default = RestResponseMessage;

},{"options":9}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryTranslator = exports.QueryFactory = exports.Repository = exports.SortDirection = exports.Query = exports.QueryBase = exports.Batch = exports.BasicAuthentication = exports.NoCaching = exports.RestMessageInterceptorBase = exports.JsonMediaTypeFormatter = exports.MediaTypeFormatterBase = exports.RestMessageHandler = exports.RestMessageHandlerBase = exports.RestMessageContext = exports.RestBulkResponseMessage = exports.RestBulkRequestMessage = exports.RestResponseMessage = exports.RestRequestMessage = exports.RestClient = exports.UrlBuilder = exports.RestClientError = exports.CancellationTokenSource = exports.CancellationToken = exports.Options = undefined;

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

var _cancellationToken = require('cancellation-token');

var _cancellationToken2 = _interopRequireDefault(_cancellationToken);

var _cancellationTokenSource = require('cancellation-token-source');

var _cancellationTokenSource2 = _interopRequireDefault(_cancellationTokenSource);

var _restClientError = require('rest-client-error');

var _restClientError2 = _interopRequireDefault(_restClientError);

var _urlBuilder = require('url-builder');

var _urlBuilder2 = _interopRequireDefault(_urlBuilder);

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

var _restMessageContext = require('rest-message-context');

var _restMessageContext2 = _interopRequireDefault(_restMessageContext);

var _restMessageHandlerBase = require('rest-message-handler-base');

var _restMessageHandlerBase2 = _interopRequireDefault(_restMessageHandlerBase);

var _restMessageHandler = require('rest-message-handler');

var _restMessageHandler2 = _interopRequireDefault(_restMessageHandler);

var _mediaTypeFormatterBase = require('media-type-formatter-base');

var _mediaTypeFormatterBase2 = _interopRequireDefault(_mediaTypeFormatterBase);

var _jsonMediaTypeFormatter = require('json-media-type-formatter');

var _jsonMediaTypeFormatter2 = _interopRequireDefault(_jsonMediaTypeFormatter);

var _restMessageInterceptorBase = require('rest-message-interceptor-base');

var _restMessageInterceptorBase2 = _interopRequireDefault(_restMessageInterceptorBase);

var _noCaching = require('no-caching');

var _noCaching2 = _interopRequireDefault(_noCaching);

var _basicAuthentication = require('basic-authentication');

var _basicAuthentication2 = _interopRequireDefault(_basicAuthentication);

var _batch = require('batch');

var _batch2 = _interopRequireDefault(_batch);

var _queryBase = require('query-base');

var _queryBase2 = _interopRequireDefault(_queryBase);

var _query = require('query');

var _query2 = _interopRequireDefault(_query);

var _sortDirection = require('sort-direction');

var _sortDirection2 = _interopRequireDefault(_sortDirection);

var _repository = require('repository');

var _repository2 = _interopRequireDefault(_repository);

var _queryFactory = require('query-factory');

var _queryFactory2 = _interopRequireDefault(_queryFactory);

var _queryTranslator = require('query-translator');

var _queryTranslator2 = _interopRequireDefault(_queryTranslator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Options = _options2.default;
exports.CancellationToken = _cancellationToken2.default;
exports.CancellationTokenSource = _cancellationTokenSource2.default;
exports.RestClientError = _restClientError2.default;
exports.UrlBuilder = _urlBuilder2.default;
exports.RestClient = _restClient2.default;
exports.RestRequestMessage = _restRequestMessage2.default;
exports.RestResponseMessage = _restResponseMessage2.default;
exports.RestBulkRequestMessage = _restBulkRequestMessage2.default;
exports.RestBulkResponseMessage = _restBulkResponseMessage2.default;
exports.RestMessageContext = _restMessageContext2.default;
exports.RestMessageHandlerBase = _restMessageHandlerBase2.default;
exports.RestMessageHandler = _restMessageHandler2.default;
exports.MediaTypeFormatterBase = _mediaTypeFormatterBase2.default;
exports.JsonMediaTypeFormatter = _jsonMediaTypeFormatter2.default;
exports.RestMessageInterceptorBase = _restMessageInterceptorBase2.default;
exports.NoCaching = _noCaching2.default;
exports.BasicAuthentication = _basicAuthentication2.default;
exports.Batch = _batch2.default;
exports.QueryBase = _queryBase2.default;
exports.Query = _query2.default;
exports.SortDirection = _sortDirection2.default;
exports.Repository = _repository2.default;
exports.QueryFactory = _queryFactory2.default;
exports.QueryTranslator = _queryTranslator2.default;

},{"basic-authentication":1,"batch":3,"cancellation-token":5,"cancellation-token-source":4,"json-media-type-formatter":6,"media-type-formatter-base":7,"no-caching":8,"options":9,"query":13,"query-base":10,"query-factory":11,"query-translator":12,"repository":14,"rest-bulk-request-message":15,"rest-bulk-response-message":16,"rest-client":18,"rest-client-error":17,"rest-message-context":19,"rest-message-handler":21,"rest-message-handler-base":20,"rest-message-interceptor-base":22,"rest-request-message":23,"rest-response-message":24,"sort-direction":27,"url-builder":28}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RetryPolicy {

  constructor(options) {
    _options2.default.assign(this, options);
  }

}
exports.default = RetryPolicy;

},{"options":9}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class SortDirection {}

exports.default = SortDirection;
SortDirection.Asc = 1;
SortDirection.Desc = -1;

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _options = require('options');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UrlBuilder {

  constructor(options) {
    this.scheme = 'http';
    this.host = 'localhost';
    this.port = 80;
    this.path = '/';
    this.queryString = null;
    _options2.default.assign(this, options);
  }

  toString() {
    var url = '';
    if (this.scheme) {
      url += `${ this.scheme }://`;
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
    if (this.path && this.path !== '/') {
      if (!this.path.startsWith('/')) {
        path += '/' + this.path;
      } else {
        url += this.path;
      }
    }
    if (this.queryString) {
      url += '?' + this.queryString;
    }
    return url;
  }

}
exports.default = UrlBuilder;

},{"options":9}]},{},[25])(25)
});


//# sourceMappingURL=rest.js.map
