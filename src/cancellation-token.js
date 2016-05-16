import RestClientError from 'rest-client-error';

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
      throw new RestClientError({
        message: "Operation has been canceled"
      });
    }
  }
}

CancellationToken.none = new CancellationToken();