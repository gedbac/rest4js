import CancellationToken from "cancellation-token";
import BatchExecutionContext from "batch-execution-context";

export default class Batch {

  constructor() {
    this._operations = [];
  }

  add(operation) {
    if (operation && typeof operation === 'function') {
      this._operations.push(operation);
    } else {
      throw {
        message: "Operation is not defined or it's type is invalid"
      };
    }
    return this;
  }

  execute(cancellationToken = CancellationToken.none) {
    return new Promise((resolve, reject) => {
      try {
        if (this._operations && this._operations.length > 0) {
          BatchExecutionContext.begin({
            batch: this
          });
          this._operations.forEach(operation => {
            operation();
          });
          BatchExecutionContext.end();
        }
        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

}