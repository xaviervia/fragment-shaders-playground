'use strict'

let listeners = {
	resize: function () {
		this.canvas.style.width 	= window.innerWidth + "px"
		this.canvas.style.height 	= window.innerHeight + "px"
		this.canvas.width 				= window.innerWidth * 2
		this.canvas.height 				= window.innerHeight * 2
	},

	mousemove: function (event) {
		this.mouse.x = event.offsetX
		this.mouse.y = event.offsetY
	}
}

class App {
	constructor() {
		this.mouse = { x: 100, y: 100 }
		this.start = Date.now()
		this.canvas = document.querySelector('[id="canvas"]')

		window.addEventListener('resize', listeners.resize.bind(this) )
		this.canvas.addEventListener('mousemove', listeners.mousemove.bind(this) )

		listeners.resize.call(this)

		this.program = new Program(
			this.canvas.getContext("webgl"),
			document.querySelector('[id="script.fragment"]').textContent,
			document.querySelector('[id="script.vertex"').textContent
		)

		.addUniform('time', 1, function () {
			return (Date.now() - this.start) / 1000.0
		}.bind(this))

		.addUniform('resolution', 2, function () {
			return [
				this.canvas.clientWidth * 2,
				this.canvas.clientHeight * 2
			]
		}.bind(this))

		.addUniform('mouse', 2, function () {
			return [
				parseFloat(this.mouse.x),
				parseFloat(this.canvas.clientHeight - this.mouse.y)
			]
		}.bind(this))

		.start()
	}
}


window.addEventListener('DOMContentLoaded', function() {
	new App
})
