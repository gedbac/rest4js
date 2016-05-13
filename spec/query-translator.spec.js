describe("Query translator", function () {

  var queryTranslator = null;

  beforeEach(function () {
    queryTranslator = new rest.QueryTranslator();
  });

  afterEach(function () {
    queryTranslator = null;
  });

  it("should extract parameter names from path", function () {
    var path = '/api/users/{userId}/settings/{name}/value';
    var parameters = queryTranslator.getParameterNames(path);
    expect(parameters).not.toBe(null);
    expect(parameters).toEqual(jasmine.arrayContaining(['userId', 'name']));
  });

  it("should not return any parameter names", function () {
    var path = '/api/users';
    var parameters = queryTranslator.getParameterNames(path);
    expect(parameters).toBe(null);
  });

  it("should set parameters in the path", function () {
    var query = new rest.Query({
      path: '/api/users/{userId}',
      parameters: {
        userId: 42
      }
    });
    var path = queryTranslator.getPath(query);
    expect(path).toEqual('/api/users/42');
  });

  it("should remove unset parameters from the path", function () {
    var query = new rest.Query({
      path: '/api/users'
    });
    var path = queryTranslator.getPath(query);
    expect(path).toEqual('/api/users');
  });

  it("should serialize parameters to query string", function () {
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

  it ("should translate query to request message", function () {
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