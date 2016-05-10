import Options from 'options';

export default class MediaTypeFormatter {

  constructor(options) {
    this.contentType = null;
    Options.extend(this, options);
  }

  read(content) {
    throw new {
      message: "Method 'read' is not supported for class 'MediaTypeFormatter'"
    };
  }

  write(value) {
    throw new {
      message: "Method 'write' is not supported for class 'MediaTypeFormatter'"
    };
  }

}