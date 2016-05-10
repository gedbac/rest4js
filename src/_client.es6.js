import ClientSettings from "client-settings";
import Operation from "operation";
import OperationExecutionContext from "operation-execution-context";
import CancellationToken from "cancellation-token";

export default class Client {

  constructor(settings) {
    if (settings && settings instanceof ClientSettings) {
      this.settings = settings;
    } else {
      this.settings = new ClientSettings(settings);
    }
  }

  execute(operation, cancellationToken = CancellationToken.none) {
    if (operation && operation instanceof Operation) {
      var context = new OperationExecutionContext();
      return operation.execute(context, cancellationToken);
    } else {
      throw {
        message: "Operation is not set or it's type is invalid"
      };
    }
  }

}