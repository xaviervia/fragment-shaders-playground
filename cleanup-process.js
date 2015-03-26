var CleanupProcess = function () {
  this.canvas = document.querySelector("canvas");
  this.code = document.querySelector('[type="text/glsl"]').textContent;
  this.text = this.code
  this.vbo = []
  this.gl = this.setupWebGL()

  console.log("Creating WebGL context");
  this.loadShader();

  console.log("Creating Vbo");

  this.loadUVS()
  this.defineVertex()

}

CleanupProcess.prototype.loadUVS = function () {
  var uvs;
  var texCoordLocation = this.gl.getAttribLocation(this.program, "a_texcoord");
  uvs = this.gl.createBuffer();
  this.gl.bindBuffer( this.gl.ARRAY_BUFFER, uvs);
  this.gl.bufferData( this.gl.ARRAY_BUFFER, new Float32Array([0.0,  0.0,
                          1.0,  0.0,
                          0.0,  1.0,
                          0.0,  1.0,
                          1.0,  0.0,
                          1.0,  1.0]), this.gl.STATIC_DRAW);
  this.gl.enableVertexAttribArray( texCoordLocation );
  this.gl.vertexAttribPointer( texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);
  this.vbo.push(uvs);
}

CleanupProcess.prototype.defineVertex = function () {
  // Define Vertex buffer
  var vertices;
  var positionLocation = this.gl.getAttribLocation(this.program, "a_position");
  vertices = this.gl.createBuffer();
  this.gl.bindBuffer( this.gl.ARRAY_BUFFER, vertices);
  this.gl.bufferData( this.gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0,
                          1.0, -1.0,
                          -1.0,  1.0,
                          -1.0,  1.0,
                          1.0, -1.0,
                          1.0,  1.0]), this.gl.STATIC_DRAW);
  this.gl.enableVertexAttribArray( positionLocation );
  this.gl.vertexAttribPointer( positionLocation , 2, this.gl.FLOAT, false, 0, 0);
  this.vbo.push(vertices);
}

CleanupProcess.prototype.loadShader = function (_shaderSrc ) {

	var vertString = "precision mediump float;\n\
uniform vec2 u_resolution;\n\
uniform float u_time;\n\
attribute vec2 a_position;\n\
attribute vec2 a_texcoord;\n\
varying vec2 v_texcoord;\n\
void main() {\n\
   gl_Position = vec4(a_position, 0.0, 1.0);\n\
   v_texcoord = a_texcoord;\n\
}";

	var vertexShader = this.createShader(vertString, this.gl.VERTEX_SHADER);
	var fragmentShader = this.createShader(this.text,
    this.gl.FRAGMENT_SHADER
  );

	if(!fragmentShader){
		fragmentShader = this.createShader("void main(){\n\
	gl_FragColor = vec4(1.0);\n\
}" , this.gl.FRAGMENT_SHADER);
	}

	// Create and use program
	this.program = this.createProgram( [vertexShader, fragmentShader]);
	this.gl.useProgram(this.program);

	return this.program;
}

CleanupProcess.prototype.createShader = function (_source, _type) {
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


CleanupProcess.prototype.createProgram = function (shaders, opt_attribs, opt_locations) {
  var program = this.gl.createProgram();
  for (var ii = 0; ii < shaders.length; ++ii) {
	this.gl.attachShader(program, shaders[ii]);
  }
  if (opt_attribs) {
	for (var ii = 0; ii < opt_attribs.length; ++ii) {
	  this.gl.bindAttribLocation(
		  program,
		  opt_locations ? opt_locations[ii] : ii,
		  opt_attribs[ii]);
	}
  }
  this.gl.linkProgram(program);

  // Check the link status
  var linked = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
  return program;
};

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
};

CleanupProcess.prototype.loadTexture = function (_texture) {
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


CleanupProcess.prototype.setupWebGL = function () {
  try {
    return this.canvas.getContext("webgl");
  }

  catch (e) {
    return this.canvas.getContext("experimental-webgl");
  }
}


CleanupProcess.prototype.renderShaders = function () {
	this.renderShader()
  var that = this
	window.requestAnimFrame(function () {
    that.renderShaders()
  })
}

CleanupProcess.prototype.renderShader = function () {
	// set the time uniform
	var timeFrame = Date.now();
	var time = (timeFrame-timeLoad) / 1000.0;
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
