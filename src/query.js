import QueryBase from 'query-base';

export default class Query extends QueryBase {

  constructor(options) {
    super(options);
  }

  skip(value) {
    return this.setParameter('skip', value);
  }

  take(value) {
    return this.setParameter('take', value);
  }

}