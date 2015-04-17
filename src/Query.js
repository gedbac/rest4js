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