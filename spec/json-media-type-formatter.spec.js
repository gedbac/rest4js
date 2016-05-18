describe("Json media type formatter", () => {

  var jsonMediaTypeFormatter = null;

  beforeEach(() => {
    jsonMediaTypeFormatter = new rest.JsonMediaTypeFormatter();
  });

  afterEach(() => {
    jsonMediaTypeFormatter = null;
  });

  it("should write object to output", () => {
    var obj = {
      id: 42,
      name: "tom"
    };
    var output = jsonMediaTypeFormatter.write(obj);
    expect(output).toEqual("{\"id\":42,\"name\":\"tom\"}");
  });

  it("should write to pretty print output", () => {
    var obj = {
      id: 42,
      name: "tom"
    };
    jsonMediaTypeFormatter.indent = 2;
    var output = jsonMediaTypeFormatter.write(obj);
    expect(output).toEqual(`{\n  \"id\": 42,\n  \"name\": \"tom\"\n}`);
  });

  it("should return null on write if value is null", () => {
    var content = jsonMediaTypeFormatter.write(null);
    expect(content).toBeNull();
  });

  it("should read anonymous object", () => {
    var content = "{\"id\":42,\"name\":\"tom\"}";
    var obj = jsonMediaTypeFormatter.read(content);
    expect(obj).not.toBeNull();
    expect(obj.id).toEqual(42);
    expect(obj.name).toEqual("tom");
  });

  it("should read strongly typed object", () => {
    class User {
      constructor(options) {
        this.id = options.id;
        this.name = options.name;
      }
    }
    var content = "{\"id\":42,\"name\":\"tom\"}";
    var obj = jsonMediaTypeFormatter.read(content, User);
    expect(obj).not.toBeNull();
    expect(obj instanceof User).toBe(true);
    expect(obj.id).toEqual(42);
    expect(obj.name).toEqual("tom");
  });

  it("should return null on read if content is null", () => {
    var content = jsonMediaTypeFormatter.read(null);
    expect(content).toBeNull();
  });

});