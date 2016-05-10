// it has to have username and password fields
var DataSource = function (options) {
	this.__protocol = 'http';
	this.__host = 'localhost';
	this.__port = 80;
	this.__timeout = 30;
	if (options && 'protocol' in options) {
		this.__protocol = options.protocol;
	}
	if (options && 'host' in options) {
		this.__host = options.host;
	}
	if (options && 'port' in options) {
		this.__port = options.port;
	}
	if (options && 'timeout' in options) {
		this.__timeout = options.timeout;
	}
	Object.defineProperty(this, '__protocol', { enumerable: false });
	Object.defineProperty(this, '__host', { enumerable: false });
	Object.defineProperty(this, '__port', { enumerable: false });
	Object.defineProperty(this, '__timeout', { enumerable: false });
  Object.seal(this);
};

DataSource.prototype = Object.create(Object.prototype, {

	protocol: {
		get: function () {
			return this.__protocol;
		},
		set: function (value) {
			this.__protocol = value;
		},
		enumerable: true
	},

	host: {
		get: function () {
			return this.__host;
		},
		set: function (value) {
			this.__host = value;
		},
		enumerable: true
	},

	port: {
		get: function () {
			return this.__port;
		},
		set: function (value) {
			this.__port = value;
		},
		enumerable: true
	},

	timeout: {
		get: function () {
			return this.__timeout;
		},
		set: function (value) {
			this.__timeout = value;
		},
		enumerable: true
	},

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