'use strict'

let App 		= undefined

window.addEventListener('DOMContentLoaded', function() {
	let start 	= Date.now()
	let mouse 	= {x: 0, y: 0}
	let canvas = document.querySelector('#canvas')

	canvas.addEventListener('mousemove', function (e) {
		mouse.x = e.clientX
		mouse.y = e.clientY
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
		return [mouse.x, mouse.y]
	})

	.start()
})
