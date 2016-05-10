import Options from 'options';
import CancellationToken from "cancellation-token";
import RestRequestMessage from "rest-request-message";

export default class Query {

  constructor(options) {
    this.client = null;
    this.method = 'GET';
    this.path = '/';
    this.headers = {};
    this.content = null;
    this.parameters = {};
    this.timeout = 0;
    Options.extend(this, options);
  }

  setMethod(value) {
    if (!value) {
      throw {
        message: "Parameter 'value' is passed to the method 'setMethod'"
      };
    }
    this.method = value;
    return this;
  }

  setPath(value) {
    if (!value) {
      throw {
        message: "Parameter 'value' is passed to the method 'setPath'"
      };
    }
    this.path = value;
    return this;
  }

  setHeader(name, value) {
    if (!name) {
      throw {
        message: "Parameter 'name' is not passed to method 'setHeader'"
      };
    }
    this.headers[name] = value;
    return this;
  }

  setContent(value) {
    this.content = value;
    return this;
  }

  setParameter(name, value) {
    if (!name) {
      throw {
        message: "Parameter 'name' is not passed to method 'setParameter'"
      };
    }
    this.parameters[name] = value;
    return this;
  }

  setParameters(parameters) {
    if (parameters) {
      for (var parameterName in parameters) {
        this.setParameter(parameterName, parameters[parameterName]);
      }
    }
    return this;
  }

  get() {
    return this.setMethod('GET');
  }

  save() {
    return this.setMethod('POST');
  }

  update() {
    return this.setMethod('PUT');
  }

  patch() {
    return this.setMethod('PATCH');
  }

  del() {
    return this.setMethod('DELETE');
  }

  skip(value) {
    return this.setParameter('skip', value);
  }

  take(value) {
    return this.setParameter('take', value);
  }

  execute(cancellationToken = CancellationToken.none) {
    // TODO: route has to build here
    var requestMessage = new RestRequestMessage({
      method: this.method,
      path: this.path,
      headers: this.headers,
      content: this.content,
      timeout: this.timeout
    });
    return this.client.send(requestMessage, cancellationToken);
  }
}