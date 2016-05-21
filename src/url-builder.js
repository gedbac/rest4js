import Options from 'options';

export default class UrlBuilder {

  constructor(options) {
    this.scheme = 'http';
    this.host = 'localhost';
    this.port = 80;
    this.path = '/';
    this.queryString = null;
    Options.assign(this, options);
  }

  toString() {
    var url = '';
    if (this.scheme) {
      url += `${this.scheme}://`;
    } else {
      url += 'http://';
    }
    if (this.host) {
      url += `${this.host}`;
    } else {
      url += 'localhost';
    }
    if (this.port && this.port !== 80) {
      url += `:${this.port}`;
    }
    if (this.path && this.path !== '/') {
      if (!this.path.startsWith('/')) {
        path += '/' + this.path;
      } else {
        url += this.path;
      }
    }
    if (this.queryString) {
      url += '?' + this.queryString;
    }
    return url;
  }

}