import CancellationToken from "cancellation-token";
import Options from 'options';

export default class Repository {

  constructor(options) {
    this.client = null;
    this.path = null;
    this.objectType = null;
    Options.extend(this, options);
  }

  query() {
    var query = null;
    var queryFactory = null;
    if (this.client && this.client.services) {
      queryFactory = this.client.services.queryFactory;
    }
    if (queryFactory) {
      query = queryFactory.create({
        client: this.client,
        path: this.path
      });
    } else {
      throw {
        message: "Query factoy is undefined"
      };
    }
    return query;
  }

  get(parameters, cancellationToken = CancellationToken.none) {
    return new Promise((resolve, reject) => {
      try {
        this
          .query({
            client: this.client,
            path: this.path
          })
          .get()
            .setParameters(parameters)
            .execute(cancellationToken)
            .then(responseMessage => {
              if (responseMessage.status >= 200 && responseMessage.status < 300) {
                resolve(responseMessage.content);
              } else {
                if (responseMessage.content) {
                  reject(responseMessage.content);
                } else {
                  reject({
                    message: responseMessage.statusText
                  });
                }
              }
            })
            .catch(ex => reject(ex));
      } catch(ex) {
        reject(ex);
      }
    });
    // if (!BatchExecutionContext.current) {
    //   return this.client.send(requestMessage);
    // } else {
    //   var context = BatchExecutionContext.current;
    //   if (!context.client) {
    //     context.client = this.client;
    //   } else if (context.client == this.client) {
    //     context.requestMessages.push(requestMessage);
    //   } else {
    //     // TODO: review error message
    //     throw {
    //       message: "All operation has to use same rest client"
    //     };
    //   }
    //   // TODO: bla bla bla
    //   // return promise...
    // }
  }

  save(parameters, value, cancellationToken = CancellationToken.none) {
    throw {
      message: "Not implemented"
    };
  }

  update(parameters, value, cancellationToken = CancellationToken.none) {
    throw {
      message: "Not implemented"
    };
  }

  patch(parameters, value, cancellationToken = CancellationToken.none) {
    throw {
      message: "Not implemented"
    };
  }

  del(parameters, value, cancellationToken = CancellationToken.none) {
    throw {
      message: "Not implemented"
    };
  }

}