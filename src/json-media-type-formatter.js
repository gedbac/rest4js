import Options from 'options';
import MediaTypeFormatterBase from 'media-type-formatter-base';

export default class JsonMediaTypeFormatter extends MediaTypeFormatterBase {

  constructor(options) {
    super();
    this.indent = 0;
    this.mediaTypes.push('application/json');
    this.defaultMediaType = 'application/json';
    Options.assign(this, options);
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
      return JSON.stringify(value, null, this.indent);
    }
    return null;
  }
}