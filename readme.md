#rest4js

[![devDependency Status](https://david-dm.org/gedbac/rest4js/dev-status.svg)](https://david-dm.org/gedbac/rest4js#info=devDependencies)
[![Build Status](https://secure.travis-ci.org/gedbac/rest4js.svg)](http://travis-ci.org/gedbac/rest4js)

Stability: Under development

    var dataSource = new rest.DataSource({
      host: 'localhost'
    });

    var userRepository = new rest.Repository({
      dataSource: dataSource,
      path: '/api/users'
    });

    userRepository
      .get(42)
      .then(context => {

      })
      .catch(reason => {
        
      });

    var userSettingRepository = new rest.Repository({
      dataSource: dataSource,
      path: '/api/users/:id/settings'
    });

    var batch = new rest.Batch()
      .then(userRepository.get)
      .then(userSettingRepository.get);

## CRUD

### repository.get(id, callback)

    repository.get(id, function (e) {
      if (!e.error && !e.cancelled) {
        entity = e.result;
      }
    });

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

## Cancellation

    var op = repository.get(id, function (e) {
      if (!e.error && !e.cancelled) {
        entity = e.result;
      }
    });

    op.cancel();

## Batching

    var batch = new BatchOperation()
      .add(function () {
        return repository.get(id, function (e) {
          if (!e.error && !e.cancelled) {
            document = e.result;
          }
        });
      })
      .execute(function (e) {});
