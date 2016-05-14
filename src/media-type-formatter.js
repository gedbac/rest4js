import Options from 'options';

export default class MediaTypeFormatter {

  constructor(options) {
    this.mediaTypes = [];
    this.defaultMediaType = null;
    Options.extend(this, options);
  }

  canReadType(objectType) {
    return true;
  }

  carWriteType(objectType) {
    return true;
  }

  read(content, objectType) {
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