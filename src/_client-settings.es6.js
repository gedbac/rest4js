export default class ClientSettings {

  constructor(options) {
    options = options || {};
    this.protocol = options.protocol || 'http';
    this.host = options.host || 'localhost';
    this.port = options.port || 80;
    this.timeout = options.port || 30;
  }

}