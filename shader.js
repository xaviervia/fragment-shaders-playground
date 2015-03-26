'use strict'

class Shader {
  constructor(context, code, type, program) {
    this.shader = context.createShader(type)

    context.shaderSource(this.shader, code)
  	context.compileShader(this.shader)

  	if (!context.getShaderParameter(this.shader, context.COMPILE_STATUS)) {
  		// Something went wrong during compilation; get the error
  		let lastError = context.getShaderInfoLog(this.shader);

      throw Error(`*** Error compiling shader '${this.shader}': ${lastError}`)
  	}

    context.attachShader( program, this.shader )
  }
}
