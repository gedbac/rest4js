import Options from 'options';

export default class BatchExecutionContext {

  constructor(options) {
    this.batch = null;
    this.client = null;
    this.requestMessages = [];
    Options.extend(this, options);
  }

  static get current() {
    var activeExecutionContexts = BatchExecutionContext.activeExecutionContexts;
    if (activeExecutionContexts && activeExecutionContexts.length > 0) {
      return activeExecutionContexts[activeExecutionContexts.length - 1];
    }
    return null;
  }

  static begin(options) {
    var context = new BatchExecutionContext(options);
    if (!BatchExecutionContext.activeExecutionContexts) {
      BatchExecutionContext.activeExecutionContexts = [];
    }
    BatchExecutionContext.activeExecutionContexts.push(context);
  }

  static end() {
    if (BatchExecutionContext.activeExecutionContexts) {
      BatchExecutionContext.activeExecutionContexts.pop();
    }
  }
}