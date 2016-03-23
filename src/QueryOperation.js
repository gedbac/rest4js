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