'use strict'

class Uniform {
  constructor(name, dimensions, value) {
    this.name = name
    this.dimensions = dimensions
    this.value = value
  }

  run(context, program, logger) {
    let value = this.value()

    switch (this.dimensions) {
      case 1:
        context.uniform1f(
          context.getUniformLocation(program, this.name),
          value
        )

        logger.log(this.name, value)
        break

      case 2:
        context.uniform2f(
          context.getUniformLocation(program, this.name),
          value[0], value[1]
        )

        logger.log(this.name, value.join(" x "))
        break
    }
  }
}
