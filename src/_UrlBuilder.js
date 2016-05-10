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