'use strict'

let App 		= undefined
let canvas 	= undefined

window.addEventListener('DOMContentLoaded', function() {
	let start 	= Date.now()
	let mouse 	= {x: 0, y: 0}
	canvas = document.querySelector('#canvas')

	canvas.addEventListener('mousemove', function (e) {
		mouse.x = e.offsetX
		mouse.y = e.offsetY
	})

	App = new Program(
		canvas.getContext("webgl"),
		document.querySelector('#fragment').textContent,
		document.querySelector('#vertex').textContent
	)

	.addUniform('time', 1, function () {
		return (Date.now() - start) / 1000.0
	})

	.addUniform('resolution', 2, function () {
		return [canvas.clientWidth, canvas.clientHeight]
	})

	.addUniform('mouse', 2, function () {
		return [parseFloat(mouse.x), parseFloat(canvas.clientHeight - mouse.y)]
	})

	.start()
})
