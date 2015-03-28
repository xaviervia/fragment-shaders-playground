'use strict'



const UVS = [0.0,  0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,  0.0, 1.0,  1.0]
const VERTICES = [-1.0, -1.0, 1.0, -1.0, -1.0,  1.0, -1.0,  1.0, 1.0, -1.0, 1.0,  1.0]

var start = Date.now()


class Program {


  // ===========================================================================
  // PUBLIC
  // ===========================================================================
  constructor(context, code, vertexCode) {
    this.context = context
    this.logger = new Logger

    this.program = this.context.createProgram()

    console.log("Creating WebGL context")
    new Shader(
      this.context,
      vertexCode,
      this.context.VERTEX_SHADER,
      this.program
    )

    new Shader(
      this.context,
      code,
      this.context.FRAGMENT_SHADER,
      this.program
    )

    // Create and use program
    this.context.linkProgram(this.program)
    this.context.useProgram(this.program)

    console.log("Creating Vbo")
    new VertexBufferObject(this.context, 'a_texcoord', UVS, this.program)
    new VertexBufferObject(this.context, 'a_position', VERTICES, this.program)

    this.uniforms = []
  }


  start() {
    this.loop()

    return this
  }


  addUniform(name, dimensions, value) {
    this.uniforms.push(new Uniform(name, dimensions, value))

    return this
  }



  // ===========================================================================
  // PRIVATE
  // ===========================================================================
  loop() {
  	this.render()
  	window.requestAnimationFrame(this.loop.bind(this))
  }


  render() {
  	// Bind the uniforms
    this.uniforms.forEach(function (uniform) {
      uniform.run(this.context, this.program, this.logger)
    }.bind(this))

  	// Draw
  	this.context.drawArrays(this.context.TRIANGLES, 0, 6)
  }
}
