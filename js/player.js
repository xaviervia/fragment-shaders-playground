'use strict'

class Player {
  constructor(app) {
    this.app = app
    this.audiolet = new Audiolet
    this.synth = new Synth(this)
  }

  addTone(frequency, gain) {
    this.synth.addTone(frequency, gain)
    this.synth.connect(this.audiolet.output)
  }
}

class Synth extends AudioletGroup {
  constructor(player) {
    super(player.audiolet, 0, 1)

    this.player = player
    this.audiolet = player.audiolet
  }

  addTone(frequency, gain) {
    this.sine = new Sine(this.audiolet, frequency)
    // this.tones = this.tones || []
    // this.tones.push( sine )
    // this.modulator = new Saw(this.audiolet, frequency * 2)
    // this.modulatorMulAdd = new MulAdd(this.audiolet, 200, 440)
    // this.modulator.connect(this.modulatorMulAdd)
    // this.modulatorMulAdd.connect(sine)

    this.gain = new Gain(this.audiolet)
    this.gain.value.getValue = function () {
      return gain(this.player.app.time())
    }.bind(this)
    //
    // this.envelope = new PercussiveEnvelope(
    //   this.audiolet, 1, 4.5, 4.5,
    //   function () {
    //     this.audiolet.scheduler.addRelative(
    //       0, this.remove.bind(this) )
    //   }.bind(this)
    // )

    // this.envelope.connect(this.gain, 0, 1)
    this.sine.connect(this.gain)
    this.gain.connect(this.outputs[0])
  }
}
