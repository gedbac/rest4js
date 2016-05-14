#rest4js

[![devDependency Status](https://david-dm.org/gedbac/rest4js/dev-status.svg)](https://david-dm.org/gedbac/rest4js#info=devDependencies)
[![Build Status](https://secure.travis-ci.org/gedbac/rest4js.svg)](http://travis-ci.org/gedbac/rest4js)

__Stability__: Under Development

Fetch data from your RESTfull web service in the easy way.

    var client = new rest.Client({
      port: 8080
    });

    var userRepository = new rest.Repository({
      client: client,
      path: '/api/users'
    });

    userRepository
      .get()
      .then(users => {
        console.log(users);
      })
      .catch(reason => {
        console.log(reason.message || reason);
      });

Below is a sample conversation between an HTTP client and an HTTP server running on *localhost*, port *8080*.

Client request

    GET /api/users HTTP/1.1
    Host: localhost:8080
    Accept: application/json
    X-Requested-With: XMLHttpRequest

Server response

    HTTP/1.1 200 OK
    Content-Type: application/json
    Date: Sat, 07 May 2016 06:54:38 GMT
    Content-Length: 114

    [
        {
            "id": 1,
            "username": "jon"
        },
        {
            "id": 2,
            "username": "tom"
        }
    ]

## CRUD

### repository.get(parameters, cancellationToken): Promise

You can easily fetch data by given parameters.

The following example shows a regular fetch by id:

    usersRepository.get(2)
      .then(users => {
        console.log(users);
      })
      .catch(reason => {
        console.log(reason.message || reason);
      });

Sample output from the example:

    [
        {
            "id": 2,
            "username": "tom"
        }
    ]

### repository.save(entity, callback)

    repository.save(entity function (e) {
      if (!e.error && !e.cancelled) {
        id = e.id;
      }
    });

### repository.update(id, entity, callback)

    repository.update(id, entity, function (e) {
      if (!e.error && !e.cancelled) {
      }
    });

### repository.patch(id, callback)

    repository.patch(id, entity, function (e) {
      if (!e.error && !e.cancelled) {
      }
    });

### repository.del(id, callback)

    repository.get(id, function (e) {
      if (!e.error && !e.cancelled) {
      }
    });

## Queries

There is an option to build queries.

    var userRepository = new rest.Repository({
      client: client,
      path: '/api/users/:id'
    });

    var cancellationTokenSource = new rest.CancellationTokenSource();
    userRepository
      .query()
        .get()
          .setParameter('id', 2)
          .skip(0)
          .take(10)
        .execute(cancellationTokenSource.token)
        .then(() => {

        })
        .catch(ex => {

        });

If you are not confortable with current query API or something is missing in it, you can easily extend it.
You need to create your own query class and inherit it from *QueryBase or Query. Look bellow to the example how to do it.

    class MyQuery inhertis Query {

      include(fields) {
        return this.setParameter('include', fields);
      }

    }

Also query factory class has to be replaced.

    class MyQueryFactory {

      create(options) {
        return new MyQuery(options);
      }

    }

After creating your own query factory, you have to register it, so that new custom queries could be used.

    client.services.queryFactory = new MyQueryFactory();

Now you are ready to go.

## Cancellation

    var cancellationTokenSource = new rest.CancellationTokenSource();
    repository
      .get(id, cancellationTokenSource.token)
      .then(() => {})
      .catch(ex => {});

    cancellationTokenSource.cancelAfer(200);

## Batching

    var batch = new rest.Batch();
      .add(() => return repository.get(id))
      .add(() => return repository.get(id))
      .execute();

## Retry

## Interceptions

## ??

If you are not confortable with repository pattern or it restricts you to much, you can
always use lower level API, which allows to create request manually. See an example
bellow.

    var client = new rest.RestClient({
      port: 8080
    });
    var cancellationTokenSource = new rest.CancellationTokenSource();
    var requestMessage = new rest.RestRequestMessage({
      method: 'GET',
      path: '/api/users',
      headers: {
        'Accept': 'application/json'
      }
    });
    client
      .send(requestMessage, cancellationTokenSource.token)
      .then(responseMessage => {
        console.log("Users has been fetched successfuly");
      })
      .catch(ex => {
        if (cancellationTokenSource.canceled) {
          console.log(ex.message || ex);
        } else {
          console.error(ex.message || ex);
        }
      });

#Sandbox