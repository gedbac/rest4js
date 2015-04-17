(function (exports) {

  'use strict';

  exports = exports || {};

  if (typeof define === 'function' && define.amd) {
    define(function(){ return exports; });
  } else {
    window.rest = exports;
  }

  if (!('version' in exports)) {
    exports.version = '0.0.0';
  }

  var DataException = function () {
    this.__name = 'DataException';
    this.__stack = null;
    this.__message = message || "A data exception has occurred.";
    var lines, i, tmp;
    if ((typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Chrome') !== -1) ||
      (typeof navigator === 'undefined')) {
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
    Object.defineProperty(this, '__name', { enumerable: false });
    Object.defineProperty(this, '__message', { enumerable: false });
    Object.defineProperty(this, '__stack', { enumerable: false });
    Object.seal(this);
  };
  
  DataException.prototype = Object.create(Object.prototype, {
  
    name: {
      get: function () {
        return this.__name;
      },
      set: function (value) {
        this.__name = value;
      },
      enumerable: true
    },
  
    message: {
      get: function () {
        return this.__message;
      },
      set: function (value) {
        this.__message = value;
      },
      enumerable: true
    },
  
    stack: {
      get: function () {
        return this.__stack;
      },
      set: function (value) {
        this.__stack = value;
      },
      enumerable: true
    },
  
    toString: {
      value: function () {
        var msg = this.name + ': ' + this.message;
        if (this.stack) {
          msg += '\n\t' + this.stack.replace(/\n/g, '\n\t');
        }
        return msg;
      },
      enumerable: true
    }
  
  });
  
  Object.seal(DataException);
  Object.seal(DataException.prototype);
  
  exports.DataException = DataException;

  var DataSource = function () {
    Object.seal(this);
  };
  
  DataSource.prototype = Object.create(Object.prototype, {
  
    toString: {
      value: function () {
        return '[object DataSource]';
      },
      enumerable: true
    }
  
  });
  
  Object.seal(DataSource);
  Object.seal(DataSource.prototype);
  
  exports.DataSource = DataSource;

  var IOperation = Object.create(Object.prototype, {
  
    execute: {
      value: function (parameters, callback) {},
      enumerable: true
    },
  
    cancel: {
      value: function () {},
      enumerable: true
    },
  
    toString: {
      value: function () {
        return '[object IOperation]';
      },
      enumerable: true
    }
  
  });
  
  Object.freeze(IOperation);
  
  exports.IOperation = IOperation;

  var QueryOperation = function () {
    Object.seal(this);
  };
  
  QueryOperation.prototype = Object.create(Object.prototype, {
  
    execute: {
      value: function (parameters, callback) {
        
      },
      enumerable: true
    },
  
    cancel: {
      value: function () {
  
      },
      enumerable: true
    },
  
    toString: {
      value: function () {
        return '[object QueryOperation]';
      },
      enumerable: true
    }
  
  });
  
  Object.seal(QueryOperation);
  Object.seal(QueryOperation.prototype);
  
  exports.QueryOperation = QueryOperation;

  var BatchOperation = function () {
    Object.seal(this);
  };
  
  BatchOperation.prototype = Object.create(Object.prototype, {
  
    execute: {
      value: function (parameters, callback) {
        
      },
      enumerable: true
    },
  
    cancel: {
      value: function () {
  
      },
      enumerable: true
    },
    
    toString: {
      value: function () {
        return '[object BatchOperation]';
      },
      enumerable: true
    }
  
  });
  
  Object.seal(BatchOperation);
  Object.seal(BatchOperation.prototype);
  
  exports.BatchOperation = BatchOperation;

  var Query = function () {
    this.__method = 'GET';
    this.__headers = {};
    this.__content = null;
    Object.defineProperty(this, '__method', { enumerable: false });
    Object.defineProperty(this, '__headers', { enumerable: false });
    Object.defineProperty(this, '__content', { enumerable: false });
    Object.seal(this);
  };
  
  Query.prototype = Object.create(Object.prototype, {
  
    method: {
      get: function () {
        return this.__method;
      },
      enumerable: true
    },
  
    headers: {
      get: function () {
        return this.__headers;
      },
      enumerable: true
    },
  
    content: {
      get: function () {
        return this.__content;
      },
      enumerable: true
    },
  
    setMethod: {
      value: function (value) {
        if (!value) {
          throw new DataException("Parameter 'value' is not passed to the method 'setMethod'");
        }
        this.__method = value;
        return this;
      },
      enumerable: true
    },
  
    setHeader: {
      value: function (name, value) {
        if (!name) {
          throw new DataException("Parameter 'name' is not passed to the method 'setHeader'");
        }
        this.__headers[name] = value;
        return this;
      },
      enumerable: true
    },
  
    setContent: {
      value: function (content) {
        this.__content = content;
      },
      enumerable: true
    },
  
    get: {
      value: function () {
        return this.setMethod('GET');
      },
      enumerable: true
    },
  
    save: {
      value: function () {
        return this.setMethod('POST');
      },
      enumerable: true
    },
  
    update: {
      value: function () {
        return this.setMethod('PUT');
      },
      enumerable: true
    },
  
    patch: {
      value: function () {
        return this.setMethod('PATCH');
      },
      enumerable: true
    },
  
    del: {
      value: function () {
        return this.setMethod('DELETE');
      },
      enumerable: true
    },
  
    toString: {
      value: function () {
        return '[object Query]';
      },
      enumerable: true
    }
  
  });
  
  Object.seal(Query);
  Object.seal(Query.prototype);
  
  exports.Query = Query;

  var Repository = function () {
    this.__dataSource = null;
    Object.defineProperty(this, '__dataSource', { enumerable: false });
    Object.seal(this);
  };
  
  Repository.prototype = Object.create(Object.prototype, {
  
    dataSource: {
      get: function () {
        return this.__dataSource;
      },
      set: function (value) {
        this.__dataSource = value;
      },
      enumerable: true
    },
  
    get: {
      value: function (params, callback) {
        return this
          .query()
            .get()
              .setParameters(params)
              .execute(callback);
      },
      enumerable: true
    },
  
    save: {
      value: function (params, document, callback) {
        return this
          .query()
            .post()
              .setParameters(params)
              .execute(callback);
      },
      enumerable: true
    },
  
    update: {
      value: function (params, document, callback) {
        return this
          .query()
            .put()
              .setParameters(params)
              .execute(callback);
      },
      enumerable: true
    },
  
    patch: {
      value: function (params, document, callback) {
        return this
          .query()
            .patch()
              .setParameters(params)
              .execute(callback);
      },
      enumerable: true
    },
  
    del: {
      value: function (params, callback) {
        return this
          .query()
            .del()
              .setParameters(params)
              .execute(callback);
      },
      enumerable: true
    },
  
    query: {
      value: function () {
        return new Query()
          .setDataSource(this.dataSource);
      },
      enumerable: true
    },
  
    toString: {
      value: function () {
        return '[object Repository]';
      },
      enumerable: true
    }
  
  });
  
  Object.seal(Repository);
  Object.seal(Repository.prototype);
  
  exports.Repository = Repository;

} (window.rest));