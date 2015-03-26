'use strict'


class Logger {
  constructor() {
    this.targets = {}
  }

  log(target, value) {
    this.target(target).textContent = value
  }

  target(name) {
    return  this.targets[name] = this.targets[name] ||
            document.querySelector(`[id="output.${name}"]`)
  }
}
