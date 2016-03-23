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