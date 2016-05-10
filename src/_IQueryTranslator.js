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