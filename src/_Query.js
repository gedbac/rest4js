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