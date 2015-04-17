var QueryTranslator = function () {
  Object.seal(this);
};

QueryTranslator.prototype = Object.create(Object.prototype, {

  toString: {
    value: function () {
      return '[object QueryTransltor]';
    },
    enumerable: true
  }

});

Object.seal(QueryTranslator);
Object.seal(QueryTranslator.prototype);

exports.QueryTranslator = QueryTranslator;