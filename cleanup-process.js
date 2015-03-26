'use strict'

const UVS = [0.0,  0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,  0.0, 1.0,  1.0]
const VERTICES = [-1.0, -1.0, 1.0, -1.0, -1.0,  1.0, -1.0,  1.0, 1.0, -1.0, 1.0,  1.0]

var mouse = {x: 0, y: 0}

class CleanupProcess {

  constructor(canvas, output, code, vertexCode) {
    this.canvas = canvas
    this.output = output

    try { this.gl = this.canvas.getContext("webgl") }
    catch (e) { this.gl = this.canvas.getContext("experimental-webgl") }

    this.timeLoad = Date.now()
    this.program = this.gl.createProgram()

    this.canvas.addEventListener('mousemove', function(e){
        mouse.x = e.clientX
        mouse.y = e.clientY
        output.mouse.textContent = `${mouse.x} x ${mouse.y}`
    }, false)

    console.log("Creating WebGL context");
    new Shader(
      this.gl,
      vertexCode,
      this.gl.VERTEX_SHADER,
      this.program
    )

    new Shader(
      this.gl,
      code,
      this.gl.FRAGMENT_SHADER,
      this.program
    )

    // Create and use program
    this.gl.linkProgram(this.program)
    this.gl.useProgram(this.program)

    console.log("Creating Vbo");
    new VertexBufferObject(this.gl, 'a_texcoord', UVS, this.program)
    new VertexBufferObject(this.gl, 'a_position', VERTICES, this.program)

    this.loop()
  }

  // ========================================================================
  // NOT USED FOR NOW
  // ========================================================================
  loadTexture(_texture) {
  	this.gl.bindTexture(this.gl.TEXTURE_2D, _texture);
  	this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
  	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, _texture.image);
  	if (isPowerOf2(_texture.image.width) && isPowerOf2(_texture.image.height) ) {
  		this.gl.generateMipmap(this.gl.TEXTURE_2D);
  		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
  		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
  	} else {
  		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
  		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
  		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
  	}
  	this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }


  loop() {
  	this.render()
    var that = this
  	window.requestAnimFrame(function () {
      that.loop()
    })
  }

  render() {
  	// set the time uniform
  	var timeFrame = Date.now();
  	var time = (timeFrame-this.timeLoad) / 1000.0;
  	var timeLocation = this.gl.getUniformLocation(this.program, "time");
  	this.gl.uniform1f(timeLocation, time);

    this.output.time.textContent = time

  	// set the mouse uniform
		var mouseLocation = this.gl.getUniformLocation(this.program, "mouse");
		this.gl.uniform2f(mouseLocation,mouse.x,mouse.y);

  	// set the resolution uniform
  	var resolutionLocation = this.gl.getUniformLocation(this.program, "resolution");
  	this.gl.uniform2f(resolutionLocation,
      this.canvas.clientWidth, this.canvas.clientHeight);

  	this.output.resolution.textContent =
      `${this.canvas.clientWidth} x ${this.canvas.clientHeight}`

  	// for (var i = 0; i < this.textures.length; ++i){
  	//
  	// 	this.gl.uniform1i( this.gl.getUniformLocation( this.program, "u_tex"+i), i);
  	// 	this.gl.uniform2f( this.gl.getUniformLocation( this.program, "u_tex"+i+"Resolution"),
  	// 							 this.textures[i].image.width,
  	// 							 this.textures[i].image.height);
  	//
  	// 	this.gl.activeTexture(this.gl.TEXTURE0+i);
  	// 	this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[i]);
  	//
  	// }

  	// Draw the rectangle.
  	this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}

let isPowerOf2 = function (value) {
  return (value & (value - 1)) == 0;
}
