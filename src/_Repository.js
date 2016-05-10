var Repository = function (options) {
  this.__dataSource = null;
  this.__path = null;
  if (options && 'dataSource' in options) {
    this.__dataSource = options.dataSource;
  }
  if (options && 'path' in options) {
    this.__path = options.path;
  }
  Object.defineProperty(this, '__dataSource', { enumerable: false });
  Object.defineProperty(this, '__path', { enumerable: false });
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

  path: {
    get: function () {
      return this.__path;
    },
    set: function (value) {
      this.__path = value;
    },
    enumerable: true
  },

  // TODO: rename to 'find'...
  get: {
    value: function (parameters, callback) {
      if (arguments.length === 1) {
        callback = parameters;
        parameters = null;
      }
      return this
        .query()
          .get()
            .setParameters(parameters)
            .execute(callback);
    },
    enumerable: true
  },

  save: {
    value: function (parameters, document, callback) {
      return this
        .query()
          .post()
            .setParameters(parameters)
            .execute(callback);
    },
    enumerable: true
  },

  update: {
    value: function (parameters, document, callback) {
      return this
        .query()
          .put()
            .setParameters(parameters)
            .execute(callback);
    },
    enumerable: true
  },

  patch: {
    value: function (parameters, document, callback) {
      return this
        .query()
          .patch()
            .setParameters(parameters)
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