import Options from 'options';

export default class RestBulkResponseMessage {

  constructor(options) {
    this.requestMessage = null;
    this.status = null;
    this.statusText = null;
    this.headers = {};
    this.responseMessages = [];
    Options.assign(this, options);
  }

}