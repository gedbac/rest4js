import Options from 'options';

export default class RestMessageContext {

  constructor(options) {
    this.client = null;
    this.items = {};
    Options.assign(this, options);
  }

}