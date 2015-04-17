var DataSource = function () {
  Object.seal(this);
};

DataSource.prototype = Object.create(Object.prototype, {

  toString: {
    value: function () {
      return '[object DataSource]';
    },
    enumerable: true
  }

});

Object.seal(DataSource);
Object.seal(DataSource.prototype);

exports.DataSource = DataSource;