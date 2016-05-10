import Options from 'options';

export default class RestClientSettings {

  constructor(options) {
    this.protocol = 'http';
    this.host = 'localhost';
    this.port = 80;
    this.timeout = 30;
    Options.extend(this, options);
  }

}