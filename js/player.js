'use strict'

class Player {
  constructor(app) {
    this.app = app
    this.context = new AudioContext
  }

  addTone(updateFunction) {
    var tone = new Tone(this, updateFunction)

    tone.connect(this.context.destination)

    this.tones = this.tones || []
    this.tones.push(tone)
  }

  start() {
    this.tones.forEach(function (tone) { tone.start() })
    this.loop()

    return this
  }

  loop() {
  	this.tones.forEach(function (tone) { tone.update() })

  	window.requestAnimationFrame(this.loop.bind(this))
  }
}

class Tone {
  constructor(player, updateFunction) {
    this.player = player
    this.app = player.app
    this.context = this.player.context
    this.updateFunction = updateFunction

    this.oscillator = this.context.createOscillator()
    this.gain = this.context.createGain()

    this.oscillator.type = 'sine'
    this.oscillator.frequency.value = 0

    this.oscillator.connect(this.gain)
  }

  start() {
    this.oscillator.start()
  }

  update() {
    this.gain.gain.value = Math.abs(
      this.updateFunction(this.app.time())
    )
    this.oscillator.frequency.value = Math.abs(
      this.updateFunction(this.app.time())
    ) * 1000
  }

  connect(destination) {
    this.gain.connect(destination)
  }
}
