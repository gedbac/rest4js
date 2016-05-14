import RestRequestMessage from 'rest-request-message';

export default class QueryTranslator {

  constructor() {
    this._parameterNameCache = {};
  }

  translate(query) {
    var requestMessage = null;
    if (query) {
      requestMessage = new RestRequestMessage({
        method: query.method,
        path: this.getPath(query),
        queryString: this.getQueryString(query),
        headers: query.headers,
        content: query.content,
        timeout: query.timeout
      });
    } else {
      throw {
        message: "Parameter 'query' is not passed to the method 'translate'"
      };
    }
    return requestMessage;
  }

  getPath(query) {
    var path = null;
    if (query) {
      path = query.path;
      var parameterNames = this.getParameterNames(query.path);
      if (parameterNames && parameterNames.length > 0) {
        parameterNames.forEach(parameterName => {
          if (query.parameters) {
            if (parameterName in query.parameters) {
              path = path.replace(`{${parameterName}}`, query.parameters[parameterName]);
            } else {
              path = path.replace(`/{${parameterName}}`, '');
            }
          }
        });
      }
    }
    return path;
  }

  getQueryString(query) {
    var queryString = '';
    if (query && query.parameters) {
      var pathParameterNames = this.getParameterNames(query.path);
      for(var parameterName in query.parameters) {
        if (!pathParameterNames || pathParameterNames.indexOf(parameterName) === -1) {
          if (query.parameters[parameterName] !== null && query.parameters[parameterName] !== undefined) {
            if (queryString) {
              queryString += '&';
            }
            queryString += `${parameterName}=${query.parameters[parameterName]}`;
          }
        }
      }
    }
    return queryString;
  }

  getParameterNames(path) {
    var names = null;
    if (path) {
      var result = path.match(/\{(.*?)\}/g);
      if (result && result.length > 0) {
        names = [];
        result.forEach(text => {
          names.push(text.substring(1, text.length - 1));
        });
      }
    }
    return names;
  }

}