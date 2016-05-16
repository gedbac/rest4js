import Options from 'options';

export default class RestMessageInterceptor {

  constructor(options) {
    Options.assign(this, options);
  }

  beforeSend(requestMessage) {
    return Promise.resolve(requestMessage);
  }

  afterSend(responseMessage) {
    return Promise.resolve(responseMessage);
  }

}