import Query from 'query';

export default class QueryFactory {

  create(options) {
    return new Query(options);
  }

}