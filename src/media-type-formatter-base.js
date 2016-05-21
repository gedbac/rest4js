import Options from 'options';
import RestClientError from 'rest-client-error';

export default class MediaTypeFormatterBase {

  constructor(options) {
    this.mediaTypes = [];
    this.defaultMediaType = null;
    Options.assign(this, options);
  }

  read(content, objectType) {
    throw new RestClientError({
      message: "Method 'read' is not supported for class 'MediaTypeFormatterBase'"
    });
  }

  write(value) {
    throw new RestClientError({
      message: "Method 'write' is not supported for class 'MediaTypeFormatterBase'"
    });
  }

}