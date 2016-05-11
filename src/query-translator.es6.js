export default class QueryTranslator {

  constructor() {}

  translate(query) {
    var requestMessage = null;
    if (query) {
      // TODO: route has to build here
      requestMessage = new RestRequestMessage({
        method: query.method,
        path: query.path,
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

}