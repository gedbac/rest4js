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