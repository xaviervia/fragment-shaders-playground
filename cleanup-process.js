'use strict'

const UVS = [0.0,  0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,  0.0, 1.0,  1.0]
const VERTICES = [-1.0, -1.0, 1.0, -1.0, -1.0,  1.0, -1.0,  1.0, 1.0, -1.0, 1.0,  1.0]

class CleanupProcess {

  constructor(canvas, code, vertexCode) {
    this.canvas = canvas;
    this.code = code;
    this.vertexCode = vertexCode
    this.text = this.code
    this.vbo = []
    this.gl = this.setupWebGL()
    this.timeLoad = Date.now()
    this.program = this.gl.createProgram()

    console.log("Creating WebGL context");
    this.loadShader();

    console.log("Creating Vbo");

    this.addSomething("a_texcoord", UVS)
    this.addSomething("a_position", VERTICES)

    this.renderShaders()
  }

  addSomething(what, data) {
    let location = this.gl.getAttribLocation(this.program, what)
    let buffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
    this.gl.bufferData( this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW)
    this.gl.enableVertexAttribArray( location )
    this.gl.vertexAttribPointer( location, 2, this.gl.FLOAT, false, 0, 0)
    this.vbo.push(buffer)
  }

  loadShader() {
    this.gl.attachShader(
      this.program,
      this.createShader(
        this.vertexCode,
        this.gl.VERTEX_SHADER
      )
    )

    this.gl.attachShader(
      this.program,
      this.createShader(
        this.text,
        this.gl.FRAGMENT_SHADER
      )
    )

  	// Create and use program
    this.gl.linkProgram(this.program)

    // Check the link status
    this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)
    this.gl.useProgram(this.program)
  }

  createShader(_source, _type) {
    var shader = this.gl.createShader( _type );
  	this.gl.shaderSource(shader, _source);
  	this.gl.compileShader(shader);

  	var compiled = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);

  	if (!compiled) {
  		// Something went wrong during compilation; get the error
  		lastError = this.gl.getShaderInfoLog(shader);
  		console.error("*** Error compiling shader '" + shader + "':" + lastError);
  		this.gl.deleteShader(shader);
  		return null;
  	}

  	return shader;
  }

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

  setupWebGL() {
    try {
      return this.canvas.getContext("webgl");
    }

    catch (e) {
      return this.canvas.getContext("experimental-webgl");
    }
  }

  renderShaders() {
  	this.renderShader()
    var that = this
  	window.requestAnimFrame(function () {
      that.renderShaders()
    })
  }

  renderShader() {
  	// set the time uniform
  	var timeFrame = Date.now();
  	var time = (timeFrame-this.timeLoad) / 1000.0;
  	var timeLocation = this.gl.getUniformLocation(this.program, "time");
  	this.gl.uniform1f(timeLocation, time);

  	// set the mouse uniform
  	var rect = this.canvas.getBoundingClientRect();
  	if( mouse.x >= rect.left &&
  		mouse.x <= rect.right &&
  		mouse.y >= rect.top &&
  		mouse.y <= rect.bottom){

  		var mouseLocation = this.gl.getUniformLocation(this.program, "mouse");
  		this.gl.uniform2f(mouseLocation,mouse.x-rect.left,this.canvas.height-(mouse.y-rect.top));
  	}

  	// set the resolution uniform
  	var resolutionLocation = this.gl.getUniformLocation(this.program, "resolution");
  	this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);

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
