import Options from 'options';

export default class RestRequestMessage {

  constructor(options) {
    this.method = null;
    this.path = null;
    this.queryString = null;
    this.headers = null;
    this.accept = null;
    this.content = null;
    this.contentType = null;
    this.objectType = null;
    this.timeout = null;
    Options.extend(this, options);
  }

}