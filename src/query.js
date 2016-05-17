import QueryBase from 'query-base';

export default class Query extends QueryBase {

  constructor(options) {
    super(options);
  }

  fields(value) {
    return this.setParameter('fields', value);
  }

  sortBy(value) {
    // TODO: not implemented
    return this;
  }

  sortByDescending(value) {
    // TODO: not implemented
    return this;
  }

  thenBy(value) {
    // TODO: not implemented
    return this;
  }

  thenByDescending(value) {
    // TODO: not implemented
    return this;
  }

  skip(value) {
    return this.setParameter('skip', value);
  }

  limit(value) {
    return this.setParameter('limit', value);
  }

}