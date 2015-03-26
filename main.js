'use strict'

var App = undefined
window.onload = function(){
	App = new CleanupProcess(
		document.querySelector('#canvas'),
		{
			mouse: document.querySelector('[id="output.mouse"]'),
			resolution: document.querySelector('[id="output.resolution"]'),
			time: document.querySelector('[id="output.time"]')
		},
		document.querySelector('#fragment').textContent,
		document.querySelector('#vertex').textContent
	)
}
