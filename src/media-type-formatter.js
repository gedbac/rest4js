import Options from 'options';
import RestClientError from 'rest-client-error';

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
    throw new RestClientError({
      message: "Method 'read' is not supported for class 'MediaTypeFormatter'"
    });
  }

  write(value) {
    throw new RestClientError({
      message: "Method 'write' is not supported for class 'MediaTypeFormatter'"
    });
  }

}