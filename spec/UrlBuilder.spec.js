describe("Url builder's spec", function () {
  
  it("should parse parameters", function () {
    var urlBuilder = new rest.UrlBuilder('/api/users/{userId}/settings');
    var parameters = urlBuilder.getParameters();
    expect(parameters).not.toBeNull();
    expect(parameters.length).toBe(1);
  });
  
});