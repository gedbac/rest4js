var Repository = function () {
  this.__dataSource = null;
  Object.defineProperty(this, '__dataSource', { enumerable: false });
  Object.seal(this);
};

Repository.prototype = Object.create(Object.prototype, {

  dataSource: {
    get: function () {
      return this.__dataSource;
    },
    set: function (value) {
      this.__dataSource = value;
    },
    enumerable: true
  },

  get: {
    value: function (params, callback) {
      return this
        .query()
          .get()
            .setParameters(params)
            .execute(callback);
    },
    enumerable: true
  },

  save: {
    value: function (params, document, callback) {
      return this
        .query()
          .post()
            .setParameters(params)
            .execute(callback);
    },
    enumerable: true
  },

  update: {
    value: function (params, document, callback) {
      return this
        .query()
          .put()
            .setParameters(params)
            .execute(callback);
    },
    enumerable: true
  },

  patch: {
    value: function (params, document, callback) {
      return this
        .query()
          .patch()
            .setParameters(params)
            .execute(callback);
    },
    enumerable: true
  },

  del: {
    value: function (params, callback) {
      return this
        .query()
          .del()
            .setParameters(params)
            .execute(callback);
    },
    enumerable: true
  },

  query: {
    value: function () {
      return new Query()
        .setDataSource(this.dataSource);
    },
    enumerable: true
  },

  toString: {
    value: function () {
      return '[object Repository]';
    },
    enumerable: true
  }

});

Object.seal(Repository);
Object.seal(Repository.prototype);

exports.Repository = Repository;