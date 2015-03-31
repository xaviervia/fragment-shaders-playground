'use strict'

let listeners = {
	resize: function () {
		this.canvas.style.width 	= window.innerWidth + "px"
		this.canvas.style.height 	= window.innerHeight + "px"
		this.canvas.width 				= window.innerWidth * 2
		this.canvas.height 				= window.innerHeight * 2
	},

	mousemove: function (event) {
		this.cursor.x = event.offsetX
		this.cursor.y = event.offsetY
	}
}

class App {
	constructor() {
		this.cursor = { x: 100, y: 100 }
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

		this.addUniforms()

		this.program.start()
	}

	addUniforms() {
		this.program
			.addUniform('time', 1, this.time.bind(this))

			.addUniform('resolution', 2, this.resolution.bind(this))

			.addUniform('mouse', 2, this.mouse.bind(this))
	}

	time() { return (Date.now() - this.start) / 1000.0 }

	resolution() {
		return [
			this.canvas.clientWidth * 2,
			this.canvas.clientHeight * 2
		]
	}

	mouse() {
		return [
			parseFloat(this.cursor.x * 2),
			parseFloat((this.canvas.clientHeight - this.cursor.y) * 2)
		]
	}
}


window.addEventListener('DOMContentLoaded', function() {
	window.app = new App
})
