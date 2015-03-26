'use strict'

window.onload = function(){
	new CleanupProcess(
		document.querySelector("canvas"),
		document.querySelector('#fragment').textContent,
		document.querySelector('#vertex').textContent
	)
}
