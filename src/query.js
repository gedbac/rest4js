import QueryBase from 'query-base';
import SortDirection from 'sort-direction';
import RestClientError from 'rest-client-error';

export default class Query extends QueryBase {

  constructor(options) {
    super(options);
    this.sorting = null;
    this.transformation = null;
  }

  fields(fields) {
    return this.setParameter('fields', fields);
  }

  sortBy(field) {
    if (field) {
      if (!this.sorting) {
        this.sorting = [];
        this.sorting.push({
          field: field,
          direction: SortDirection.Acs
        });
      } else {
        throw new RestClientError({
          message: "Sorting is already defined"
        });
      }
    } else {
      throw new RestClientError({
        message: "Parameter 'field' is not passed to the method 'sortBy'"
      });
    }
    return this;
  }

  sortByDescending(field) {
    if (field) {
      if (!this.sorting) {
        this.sorting = [];
        this.sorting.push({
          field: field,
          direction: SortDirection.Desc
        });
      } else {
        throw new RestClientError({
          message: "Sorting is already defined"
        });
      }
    } else {
      throw new RestClientError({
        message: "Parameter 'field' is not passed to the method 'sortByDescending'"
      });
    }
    return this;
  }

  thenBy(field) {
    if (field) {
      if (this.sorting) {
        this.sorting.push({
          field: field,
          direction: SortDirection.Asc
        });
      } else {
        throw new RestClientError({
          message: "Sorting is not defined"
        });
      }
    } else {
      throw new RestClientError({
        message: "Parameter 'field' is not passed to the method 'thenBy'"
      });
    }
    return this;
  }

  thenByDescending(field) {
    if (field) {
      if (this.sorting) {
        this.sorting.push({
          field: field,
          direction: SortDirection.Desc
        });
      } else {
        throw new RestClientError({
          message: "Sorting is not defined"
        });
      }
    } else {
      throw new RestClientError({
        message: "Parameter 'field' is not passed to the method 'thenByDescending'"
      });
    }
    return this;
  }

  skip(value) {
    return this.setParameter('skip', value);
  }

  limit(value) {
    return this.setParameter('limit', value);
  }

  transform(func) {
    if (func) {
      if (typeof func === "function") {
        this.transformation = func;
      } else {
        throw new RestClientError({
          message: "Parameter 'func' passed to the method 'transform' has to be a function"
        });
      }
    } else {
      throw new RestClientError({
        message: "Parameter 'func' is not passed to the method 'transform'"
      });
    }
    return this;
  }

}