"use strict";

describe("Query translator", () => {

  var queryTranslator = null;

  beforeEach(() => {
    queryTranslator = new rest.QueryTranslator();
  });

  afterEach(() => {
    queryTranslator = null;
  });

  it("should extract parameter names from path template", () => {
    var path = '/api/users/{userId}/settings/{name}/value';
    var parameters = queryTranslator.getParameterNames(path);
    expect(parameters).not.toBe(null);
    expect(parameters).toEqual(jasmine.arrayContaining(['userId', 'name']));
  });

  it("should not return any parameter names from path template", () => {
    var path = '/api/users';
    var parameters = queryTranslator.getParameterNames(path);
    expect(parameters).toBe(null);
  });

  it("should set parameters defined in path template", () => {
    var query = new rest.Query({
      path: '/api/users/{userId}',
      parameters: {
        userId: 42
      }
    });
    var path = queryTranslator.getPath(query);
    expect(path).toEqual('/api/users/42');
  });

  it("should remove unset parameters from the path template", () => {
    var query = new rest.Query({
      path: '/api/users'
    });
    var path = queryTranslator.getPath(query);
    expect(path).toEqual('/api/users');
  });

  it("should serialize parameters to query string", () => {
    var query = new rest.Query({
      path: '/api/users',
      parameters: {
        name: "Tom",
        skip: 0,
        take: 10
      }
    });
    var path = queryTranslator.getQueryString(query);
    expect(path).toEqual('name=Tom&skip=0&take=10');
  });

  it("should translate query to request message", () => {
    var query = new rest.Query({
      method: 'GET',
      path: '/api/users',
      parameters: {
        name: 'Tom'
      }
    });
    var requestMessage = queryTranslator.translate(query);
    expect(requestMessage).not.toBe(null);
    expect(requestMessage.method).toEqual('GET');
    expect(requestMessage.path).toEqual('/api/users');
    expect(requestMessage.queryString).toEqual('name=Tom');
  });
});
//# sourceMappingURL=query-translator.spec.js.map
