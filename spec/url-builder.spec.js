describe("Url builder", () => {

  it("should build default url if no options passed", () => {
    var urlBuilder = new rest.UrlBuilder();
    expect(urlBuilder.toString()).toBe("http://localhost");
  });

  it("should build default url if all parameres are set to null", () => {
    var urlBuilder = new rest.UrlBuilder({
      scheme: null,
      host: null,
      port: null,
      path: null,
      queryString: null
    });
    expect(urlBuilder.toString()).toBe("http://localhost");
  });

  it("should build url from given parameters", () => {
    var urlBuilder = new rest.UrlBuilder({
      scheme: 'https',
      host: "acme.com",
      port: 443,
      path: '/api/users',
      queryString: 'name=tom'
    });
    expect(urlBuilder.toString()).toBe("https://acme.com:443/api/users?name=tom");
  });
});