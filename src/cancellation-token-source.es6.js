import CancellationToken from "cancellation-token";

export default class CancellationTokenSource {

  constructor() {
    this.canceled = false;
    this.token = new CancellationToken();
    this.linkedTokens = [];
  }

  cancel() {
    this.canceled = true;
    this._propagateToCancellationToken(this.token);
    if (this.linkedTokens && this.linkedTokens.length > 0) {
      for (var linkedToken in this.linkedTokens) {
        this._propagateToCancellationToken(linkedToken);
      }
    }
  }

  cancelAfter(delay) {
    setTimeout(() => {
      this.cancel();
    }, delay);
  }

  _propagateToCancellationToken(cancellationToken) {
    if (cancellationToken) {
      cancellationToken.canceled = true;
      if (cancellationToken.waitHandle) {
        cancellationToken.waitHandle();
      }
    }
  }

  static createLinkedCancellationTokenSource(linkedTokens) {
    var cancellationTokenSource = new CancellationTokenSource(linkedTokens);
    if (linkedTokens) {
      if (linkedTokens instanceof Array) {
        linkedTokens.forEach(linkedToken => {
          cancellationTokenSource.linkedTokens.push(linkedToken);
        });
      } else {
        cancellationTokenSource.linkedTokens.push(linkedTokens);
      }
    }
    return cancellationTokenSource;
  }

}