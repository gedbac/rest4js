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