import Options from 'options';

export default class RestResponseMessage {

  constructor(options) {
    this.requestMessage = null;
    this.status = null;
    this.statusText = null;
    this.headers = null;
    this.content = null;
    this.contentType = null;
    Options.assign(this, options);
  }

}