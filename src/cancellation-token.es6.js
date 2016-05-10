export default class CancellationToken {

  constructor(canceled = false) {
    this.canceled = canceled;
    this.WaitHandle = null;
  }

  register(waitHandle) {
    this.waitHandle = waitHandle;
  }

  throwIfCanceled() {
    if (this.canceled) {
      throw {
        message: "Operation has been canceled"
      };
    }
  }
}

CancellationToken.none = new CancellationToken();