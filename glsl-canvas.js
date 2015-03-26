/*
The MIT License (MIT)

Copyright (c) 2015 Patricio Gonzalez Vivo ( http://www.patriciogonzalezvivo.com )

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var timeLoad = Date.now();
var mouse = {x: 0, y: 0};
var billboards = [];

function loadShaders() {
	var list = document.getElementsByTagName("canvas");
	var canvas = document.querySelector("canvas");
  var code = document.querySelector('[type="text/glsl"]').textContent;
  var cleanup = new CleanupProcess( canvas, code )

	// Load canvas and WebGLContexta
	for(var i = 0; i < list.length; i++){

		console.log("Creating WebGL context");
		var gl = cleanup.gl;

		var program = cleanup.loadShader();

		console.log("Creating Vbo");

		cleanup.loadUVS()
		cleanup.defineVertex()

		// // Clean texture
		var textures = [];
		//
		// // Need to load textures
		// var bLoadTextures = canvas.hasAttribute('data-textures');
		//
		// if( bLoadTextures ){
		// 	// Clean the texture array
		// 	while(textures.length > 0) {
		// 		console.log("Deleting texture: " + (textures.length-1));
		// 		gl.deleteTexture(textures[textures.length-1]);
    // 			textures.pop();
		// 	}
		//
		// 	var imgList = canvas.getAttribute('data-textures').split(',');
		// 	for(var nImg in imgList){
		// 		console.log("Loading texture: " + imgList[nImg]);
		//
		// 		textures.push(gl.createTexture());
		//
		// 		gl.bindTexture(gl.TEXTURE_2D, textures[nImg]);
		// 		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 0, 255])); // red
		//
		// 		textures[nImg].image = new Image();
		// 		textures[nImg].image.onload = function(_gl,_tex) {
		// 			return function() {
		// 				loadTexture(_gl, _tex);
		// 			};
		// 		}(gl,textures[nImg]);
	  // 			textures[nImg].image.src = imgList[nImg];
		// 	}
		// }

		// Assign canvas, gl context, shader, UV/Verts buffers and animate boolean to billboard
		billboards[i] = {	canvas: canvas,
							gl: cleanup.gl,
							program: program,
							vbo: cleanup.vbo,
							textures: textures,
							mouse: mouse };
	}
}

function renderShaders(){
  renderShader( billboards[0] );
	window.requestAnimFrame(renderShaders);
}

/**
 * Creates a webgl context. If creation fails it will
 * change the contents of the container of the <canvas>
 * tag to an error message with the correct links for WebGL.
 * @param {Element} canvas. The canvas element to create a
 *     context from.
 * @param {WebGLContextCreationAttirbutes} opt_attribs Any
 *     creation attributes you want to pass in.
 * @return {WebGLRenderingContext} The created context.
 */


/*
 *	Render loop of shader in a canvas
 */
function renderShader( _billboard ) {
	if (!_billboard.gl) {
		return;
	}

	// set the time uniform
	var timeFrame = Date.now();
	var time = (timeFrame-timeLoad) / 1000.0;
	var timeLocation = _billboard.gl.getUniformLocation(_billboard.program, "time");
	_billboard.gl.uniform1f(timeLocation, time);

	// set the mouse uniform
	var rect = _billboard.canvas.getBoundingClientRect();
	if( mouse.x >= rect.left &&
		mouse.x <= rect.right &&
		mouse.y >= rect.top &&
		mouse.y <= rect.bottom){

		var mouseLocation = _billboard.gl.getUniformLocation(_billboard.program, "mouse");
		_billboard.gl.uniform2f(mouseLocation,mouse.x-rect.left,_billboard.canvas.height-(mouse.y-rect.top));
	}

	// set the resolution uniform
	var resolutionLocation = _billboard.gl.getUniformLocation(_billboard.program, "resolution");
	_billboard.gl.uniform2f(resolutionLocation, _billboard.canvas.width, _billboard.canvas.height);

	for (var i = 0; i < _billboard.textures.length; ++i){

		_billboard.gl.uniform1i( _billboard.gl.getUniformLocation( _billboard.program, "u_tex"+i), i);
		_billboard.gl.uniform2f( _billboard.gl.getUniformLocation( _billboard.program, "u_tex"+i+"Resolution"),
								 _billboard.textures[i].image.width,
								 _billboard.textures[i].image.height);

		_billboard.gl.activeTexture(_billboard.gl.TEXTURE0+i);
		_billboard.gl.bindTexture(_billboard.gl.TEXTURE_2D, _billboard.textures[i]);

	}

	// Draw the rectangle.
	_billboard.gl.drawArrays(_billboard.gl.TRIANGLES, 0, 6);
}

document.addEventListener('mousemove', function(e){
    mouse.x = e.clientX || e.pageX;
    mouse.y = e.clientY || e.pageY
}, false);

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            return window.setTimeout(callback, 1000/60);
         };
})();

/**
 * Provides cancelRequestAnimationFrame in a cross browser way.
 */
window.cancelRequestAnimFrame = (function() {
  return window.cancelCancelRequestAnimationFrame ||
         window.webkitCancelRequestAnimationFrame ||
         window.mozCancelRequestAnimationFrame ||
         window.oCancelRequestAnimationFrame ||
         window.msCancelRequestAnimationFrame ||
         window.clearTimeout;
})();
