import QueryBase from 'query-base';

export default class Query extends QueryBase {

  constructor(options) {
    super(options);
  }

  // TODO: include option to sort

  fields(value) {
    return this.setParameter('fields', value);
  }

  skip(value) {
    return this.setParameter('skip', value);
  }

  take(value) {
    return this.setParameter('take', value);
  }

}