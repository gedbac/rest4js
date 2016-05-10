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

  var UrlBuilder = function (template) {
    this.__template = null;
    this.__scheme = null;
    this.__host = null;
    this.__port = null;
    this.__path = null;
    this.__query = null;
    Object.defineProperty(this, '__template', { enumerable: false });
    Object.defineProperty(this, '__scheme',{ enumerable: false });
    Object.defineProperty(this, '__host', { enumerable: false });
    Object.defineProperty(this, '__port', { enumerable: false });
    Object.defineProperty(this, '__path', { enumerable: false });
    Object.defineProperty(this, '__query', { enumerable: false });
    Object.seal(this);
  };
  
  UrlBuilder.prototype = Object.create(Object.prototype, {
  
    getParameters: {
      value: function () {
        // TODO: not implemented
        return [];
      },
      enumerable: true
    },
  
    setParameter: { 
      value: function (name, value) {
        // TODO: not implemented
        return this;
      },
      enumerable: true
    },
    
    scheme: {
      get: function () {
        return this.__scheme;
      },
      set: function (value) {
        this.__scheme = value;
      },
      enumerable: true
    },
  
    host: {
      get: function () {
        return this.__host;
      },
      set: function (value) {
        this.__host = value;
      },
      enumerable: true
    },
    
    port: {
      get: function () {
        return this.__port;
      },
      set: function (value) {
        this.__port = value;
      },
      enumerable: true
    },
    
    path: {
      get: function () {
        return this.__path;
      },
      set: function (value) {
        this.__value = value;
      },
      enumerable: true
    },
    
    query: {
      get: function () {
        return this.__query;
      },
      set: function (value) {
        this.__query = value;
      },
      enumerable: true
    },
  
    toString: {
      value: function () {
  		  return '[object UrlBuilder]';
  	  },
      enumerable: true
    }
  
  });
  
  Object.seal(UrlBuilder);
  Object.seal(UrlBuilder.prototype);
  
  exports.UrlBuilder = UrlBuilder;

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

  // it has to have username and password fields
  var DataSource = function (options) {
  	this.__protocol = 'http';
  	this.__host = 'localhost';
  	this.__port = 80;
  	this.__timeout = 30;
  	if (options && 'protocol' in options) {
  		this.__protocol = options.protocol;
  	}
  	if (options && 'host' in options) {
  		this.__host = options.host;
  	}
  	if (options && 'port' in options) {
  		this.__port = options.port;
  	}
  	if (options && 'timeout' in options) {
  		this.__timeout = options.timeout;
  	}
  	Object.defineProperty(this, '__protocol', { enumerable: false });
  	Object.defineProperty(this, '__host', { enumerable: false });
  	Object.defineProperty(this, '__port', { enumerable: false });
  	Object.defineProperty(this, '__timeout', { enumerable: false });
    Object.seal(this);
  };
  
  DataSource.prototype = Object.create(Object.prototype, {
  
  	protocol: {
  		get: function () {
  			return this.__protocol;
  		},
  		set: function (value) {
  			this.__protocol = value;
  		},
  		enumerable: true
  	},
  
  	host: {
  		get: function () {
  			return this.__host;
  		},
  		set: function (value) {
  			this.__host = value;
  		},
  		enumerable: true
  	},
  
  	port: {
  		get: function () {
  			return this.__port;
  		},
  		set: function (value) {
  			this.__port = value;
  		},
  		enumerable: true
  	},
  
  	timeout: {
  		get: function () {
  			return this.__timeout;
  		},
  		set: function (value) {
  			this.__timeout = value;
  		},
  		enumerable: true
  	},
  
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

  var IQueryTranslator  = Object.create(Object.prototype, {
  
    translate: {
      value: function (query) {},
      enumerable: true
    },
  
    toString: {
      value: function () {
        return '[object IQueryTransltor]';
      },
      enumerable: true
    }
  
  });
  
  Object.freeze(IQueryTranslator);
  
  exports.IQueryTranslator = IQueryTranslator;

  var QueryTranslator = function () {
    Object.seal(this);
  };
  
  QueryTranslator.prototype = Object.create(Object.prototype, {
  
  	translate: {
  		value: function (query) {
        var url = null;
        if (query) {
          url = 'https://loaddex.logisticallabs.com/api';
        }
  			return url;
  		},
  		enumerable: true
  	},
  
    toString: {
      value: function () {
        return '[object QueryTranslator]';
      },
      enumerable: true
    }
  
  });
  
  Object.seal(QueryTranslator);
  Object.seal(QueryTranslator.prototype);
  
  exports.QueryTranslator = QueryTranslator;

  var OperationContext = function () {
    this.__items = {};
    this.__error = null;
    this.__cancelled = false;
    Object.defineProperty(this, '__items', { enumerable: false });
    Object.defineProperty(this, '__error', { enumerable: false });
    Object.defineProperty(this, '__cancelled', { enumerable: false });
    Object.seal(this);
  };
  
  OperationContext.prototype = Object.create(Object.prototype, {
  
    items: {
    	get: function () {
    	  return this.__items;
    	},
    	set: function (value) {
    	  this.__items = value;
    	},
    	enumerable: true
    },
    
    error: {
    	get: function () {
    	  return this.__error;
    	},
    	set: function (value) {
    	  this.___error = value;
    	}
    },
    
    cancelled: {
    	get: function () {
    	  return this.__cancelled;
    	},
    	set: function (value) {
    	  this.__cancelled = value;
    	}
    },
  	
    toString: {
      value: function () {
        return '[object OperationContext]';
      },
      enumerable: true
    }
  
  });
  
  Object.seal(OperationContext);
  Object.seal(OperationContext.prototype);
  
  exports.OperationContext = OperationContext;

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
    this.__httpRequest = null;
    Object.seal(this);
  };
  
  QueryOperation.prototype = Object.create(Object.prototype, {
  
    execute: {
      value: function (parameters, callback) {
        if (parameters && 'query' in parameters) {
          var queryTranslator = new QueryTranslator();
          this.__httpRequest = new XMLHttpRequest();
          var method = parameters.query.method,
              url = queryTranslator.translate(parameters.query);
          this.__httpRequest.open(method, url, true);
          this.__httpRequest.onreadystatechange = function () {
            if (this.__httpRequest.readyState === 4) {
              if (callback) {
                callback();
              }
            }
          }.bind(this);
          this.__httpRequest.send();
        } else if (callback) {
          callback();
        }
      },
      enumerable: true
    },
  
    cancel: {
      value: function () {
        if (this.__httpRequest) {
          this.__httpRequest.abort();
        }
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
    this.__dataSource = null;
    this.__method = 'GET';
    this.__headers = {};
    this.__content = null;
    this.__parameters = null;
    this.__timeout = null;
    Object.defineProperty(this, '__dataSource', { enumerable: false });
    Object.defineProperty(this, '__method', { enumerable: false });
    Object.defineProperty(this, '__headers', { enumerable: false });
    Object.defineProperty(this, '__content', { enumerable: false });
    Object.defineProperty(this, '__parameters', { enumerable: false });
    Object.defineProperty(this, '__timeout', { enumerable: false });
    Object.seal(this);
  };
  
  Query.prototype = Object.create(Object.prototype, {
  
    dataSource: {
      get: function () {
        return this.__dataSource;
      },
      enumerable: true
    },
  
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
  
    timeout: {
      get: function () {
        return this.__timeout;
      },
      enumerable: true
    },
  
    setDataSource: {
      value: function (value) {
        if (!value) {
          throw new DataException("Parameter 'value' is not passed to the method 'setDataSource'");
        }
        this.__dataSource = value;
        return this;
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
        return this;
      },
      enumerable: true
    },
  
    setParameters: {
      value: function (parameters) {
        if (parameters) {
          this.__parameters = parameters;
        }
        return this;
      },
      enumerable: true
    },
  
    setTimeout: {
      value: function (timeout) {
        this.__timeout = timeout;
        return this;
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
  
    execute: {
      value: function (callback) {
        return new QueryOperation()
          .execute({
            query: this
          }, callback);
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

  var Repository = function (options) {
    this.__dataSource = null;
    this.__path = null;
    if (options && 'dataSource' in options) {
      this.__dataSource = options.dataSource;
    }
    if (options && 'path' in options) {
      this.__path = options.path;
    }
    Object.defineProperty(this, '__dataSource', { enumerable: false });
    Object.defineProperty(this, '__path', { enumerable: false });
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
  
    path: {
      get: function () {
        return this.__path;
      },
      set: function (value) {
        this.__path = value;
      },
      enumerable: true
    },
  
    // TODO: rename to 'find'...
    get: {
      value: function (parameters, callback) {
        if (arguments.length === 1) {
          callback = parameters;
          parameters = null;
        }
        return this
          .query()
            .get()
              .setParameters(parameters)
              .execute(callback);
      },
      enumerable: true
    },
  
    save: {
      value: function (parameters, document, callback) {
        return this
          .query()
            .post()
              .setParameters(parameters)
              .execute(callback);
      },
      enumerable: true
    },
  
    update: {
      value: function (parameters, document, callback) {
        return this
          .query()
            .put()
              .setParameters(parameters)
              .execute(callback);
      },
      enumerable: true
    },
  
    patch: {
      value: function (parameters, document, callback) {
        return this
          .query()
            .patch()
              .setParameters(parameters)
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