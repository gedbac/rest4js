import MediaTypeFormatter from 'media-type-formatter';

export default class JsonMediaTypeFormatter extends MediaTypeFormatter {

  constructor(options) {
    super(options);
    this.contentType = this.contentType || 'application/json';
  }

  read(text) {
    return JSON.parse(text);
  }

  write(value) {
    return JSON.stringify(value);
  }
}