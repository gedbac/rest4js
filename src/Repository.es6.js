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
    if (this.client) {
      return queryFactory.create({
        client: this.client,
        path: this.path
      });
    } else {
      throw {
        message: "Client is undefined"
      };
    }
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
              if (httpRequest.status >= 200 && httpRequest.status < 300) {
                resolve(responseMessage.content);
              } else {
                // TODO: show validation errors
                reject();
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

  }

  update(parameters, value, cancellationToken = CancellationToken.none) {}

  patch(parameters, value, cancellationToken = CancellationToken.none) {}

  del(parameters, value, cancellationToken = CancellationToken.none) {}

}