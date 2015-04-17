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