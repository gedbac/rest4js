export default class Options {

  static assign(target, options) {
    if (target && options) {
      for (var propertyName in options) {
        if (propertyName in target) {
          target[propertyName] = options[propertyName];
        }
      }
    }
  }

}