import Options from 'options';
import CancellationToken from 'cancellation-token';
import RestClientError from 'rest-client-error';

export default class QueryBase {

  constructor(options) {
    this.client = null;
    this.method = 'GET';
    this.path = '/';
    this.headers = {};
    this.content = null;
    this.parameters = {};
    this.timeout = 0;
    Options.assign(this, options);
  }

  setMethod(value) {
    if (!value) {
      throw new RestClientError({
        message: "Parameter 'value' is not passed to the method 'setMethod'"
      });
    }
    this.method = value;
    return this;
  }

  setPath(value) {
    if (!value) {
      throw new RestClientError({
        message: "Parameter 'value' is not passed to the method 'setPath'"
      });
    }
    this.path = value;
    return this;
  }

  setHeader(name, value) {
    if (!name) {
      throw new RestClientError({
        message: "Parameter 'name' is not passed to method 'setHeader'"
      });
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
      throw new RestClientError({
        message: "Parameter 'name' is not passed to method 'setParameter'"
      });
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

  setTimeout(value) {
    this.timeout = value;
    return this;
  }

  execute(cancellationToken = CancellationToken.none) {
    return new Promise((resolve, reject) => {
      var queryTranslator = null;
      if (this.client && this.client.services) {
        queryTranslator = this.client.services.queryTranslator;
      }
      if (queryTranslator) {
        this.client
          .send(queryTranslator.translate(this), cancellationToken)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new RestClientError({
          message: "Query translator is undefined"
        }));
      }
    });
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

}