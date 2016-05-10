import CancellationToken from "cancellation-token";

const UNSENT = 0;
const OPENED = 1;
const HEADERS_RECEIVED = 2;
const LOADING = 3;
const DONE = 4;

export default class Operation {

  constructor(options) {
    options = options || {};
    this._httpRequest = null;
  }

  execute(context, cancellationToken = CancellationToken.none) {
    return new Promise((resolve, reject) => {
      try {
        cancellationToken.throwIfCanceled();
        cancellationToken.register(() => {
          try {
            if (this._httpRequest) {
              this._httpRequest.abort();
            }
            cancellationToken.throwIfCanceled();
          } catch (ex) {
            reject(ex);
          }
        });
        /*this._httpRequest = new XMLHttpRequest();
        this._httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        this._httpRequest.onreadystatechange = () => {
          if (this._httpRequest && this._httpRequest.readyState === DONE) {
            resolve(context);
          }
        };
        this._httpRequest.open('GET', 'https://loaddex.logisticallabs.com/api', true);
        this._httpRequest.send();*/
        setTimeout(() => {
          resolve(context);
        }, 5000);
      } catch (ex) {
        reject(ex);
      }
    });
  }

}