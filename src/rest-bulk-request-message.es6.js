import Options from 'options';
import RestRequestMessage from "rest-request-message";

export default class RestBulkRequestMessage {

  constructor(options) {
    this.method = null;
    this.path = null;
    this.headers = null;
    this.timeout = null;
    this.requestMessages = [];
    Options.extend(this, options);
  }

  add(message) {
    if (message && message instanceof RestRequestMessage) {
      if (this.requestMessages) {
        this.requestMessages.push(message);
      }
    } else {
      throw {
        message: "Message is undefined or it's type is invalid"
      };
    }
    return this;
  }

}