import Options from 'options';

export default class RestBulkResponseMessage {

  constructor() {
    this.status = null;
    this.statusText = null;
    this.headers = null;
    this.responseMessages = [];
    Options.extend(this, options);
  }

}