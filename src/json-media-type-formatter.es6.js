import MediaTypeFormatter from 'media-type-formatter';

export default class JsonMediaTypeFormatter extends MediaTypeFormatter {

  constructor(options) {
    super(options);
    this.mediaTypes.push('application/json');
    this.defaultMediaType = 'application/json';
  }

  read(text, objectType) {
    if (text) {
      var value = JSON.parse(text);
      if (objectType) {
        if (value instanceof Array) {
          var array = [];
          value.forEach(item => {
            array.push(new objectType(item));
          });
          return array;
        } else {
          value = new objectType(value);
        }
      }
      return value;
    }
    return null;
  }

  write(value) {
    if (value) {
      return JSON.stringify(value);
    }
    return null;
  }
}