import Options from 'options';

export class RestClientError {

  constructor(options) {
    this.name = 'RestClientError';
    this.stack = null;
    this.message = "A rest error has occurred.";
    var lines, i, tmp;
    if ((typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Chrome') !== -1) ||
      (typeof navigator === 'undefined')) {
      lines = new Error().stack.split('\n');
      if (lines && lines.length > 2) {
        tmp = [];
        for (i = 2; i < lines.length; i++) {
          if (lines[i]) {
            tmp.push(lines[i].trim());
          }
        }
        this.stack = tmp.join('\n');
      }
    } else if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Firefox') !== -1) {
      lines = new Error().stack.split('\n');
      if (lines && lines.length > 1) {
        tmp = [];
        for (i = 1; i < lines.length; i++) {
          if (lines[i]) {
            tmp.push('at ' + lines[i].trim().replace('@', ' (') + ')');
          }
        }
        this.stack = tmp.join('\n');
      }
    } else if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Trident') !== -1) {
      try {
        throw new Error();
      } catch (error) {
        if ('stack' in error) {
          lines = error.stack.split('\n');
          if (lines && lines.length > 2) {
            tmp = [];
            for (i = 2; i < lines.length; i++) {
              if (lines[i]) {
                tmp.push(lines[i].trim());
              }
            }
            this.stack = tmp.join('\n');
          }
        } else {
          this.stack = '';
        }
      }
    } else {
      var error = new Error();
      if ('stack' in error) {
        this.stack = error.stack;
      } else {
        this.stack = '';
      }
    }
    Options.extend(this, options);
  }

  toString() {
    var text = this.name + ': ' + this.message;
    if (this.stack) {
      text += '\n\t' + this.stack.replace(/\n/g, '\n\t');
    }
    return text;
  }

}