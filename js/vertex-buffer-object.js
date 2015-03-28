'use strict'

class VertexBufferObject {
  constructor(context, attribute, data, program) {
    let location = context.getAttribLocation(program, attribute)

    context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer())
    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array(data), context.STATIC_DRAW
    )

    context.enableVertexAttribArray( location )
    context.vertexAttribPointer( location, 2, context.FLOAT, false, 0, 0)
  }
}
