describe("Options", () => {

  it ("should assign all properties to the target object", () => {
    var options = {
      id: 42,
      name: "#TEXT"
    };
    var target = {
      id: null,
      name: null
    };
    Options.assign(target, options);
    expect(target.id).toEqual(options.id);
    expect(target.name).toEqual(options.name);
  });

  it ("should not extend property which is not defined in target", () => {
    var options = {
      name: "#TEXT"
    };
    Options.assign(target, options);
    expect(target.name).toBeUndefined();
  });

});