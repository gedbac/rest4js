import Options from 'options';

export default class RetryPolicy {

  constructor(options) {
    Options.assign(this, options);
  }

}