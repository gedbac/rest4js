var OperationContext = function () {
  this.__items = {};
  this.__error = null;
  this.__cancelled = false;
  Object.defineProperty(this, '__items', { enumerable: false });
  Object.defineProperty(this, '__error', { enumerable: false });
  Object.defineProperty(this, '__cancelled', { enumerable: false });
  Object.seal(this);
};

OperationContext.prototype = Object.create(Object.prototype, {

  items: {
  	get: function () {
  	  return this.__items;
  	},
  	set: function (value) {
  	  this.__items = value;
  	},
  	enumerable: true
  },
  
  error: {
  	get: function () {
  	  return this.__error;
  	},
  	set: function (value) {
  	  this.___error = value;
  	}
  },
  
  cancelled: {
  	get: function () {
  	  return this.__cancelled;
  	},
  	set: function (value) {
  	  this.__cancelled = value;
  	}
  },
	
  toString: {
    value: function () {
      return '[object OperationContext]';
    },
    enumerable: true
  }

});

Object.seal(OperationContext);
Object.seal(OperationContext.prototype);

exports.OperationContext = OperationContext;