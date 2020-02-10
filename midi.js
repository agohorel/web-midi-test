import { definitions } from "./midiDefinitions.js";
import Fader from "./uiComponents.js";

let faders = [];
for (let i = 0; i < 100; i++) {
  faders.push(new Fader({ parent: ".faders", name: "volume", index: i }));
  faders[i].create();
}

const potDisplay = document.querySelector(".pot");
const btnDisplay = document.querySelector(".button");

init();

function init() {
  // request midi access
  if (navigator.requestMIDIAccess) {
    navigator
      .requestMIDIAccess({ sysex: false })
      .then(onMIDISuccess, onMIDIFailure);
  } else {
    alert("no MIDI support in your browser :(");
  }
}

function onMIDISuccess(midiAccess) {
  const midi = midiAccess;
  const inputs = midi.inputs.values();

  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = onMIDIMessage;
    console.log(input);
  }

  // listen for connect/disconnect msg
  midi.onstatechange = onStateChange;
}

function onMIDIMessage(event) {
  // extract all the useful bits from the event
  const { data } = event,
    cmd = data[0] >> 4,
    channel = data[0] & 0xf,
    type = data[0] & 0xf0,
    note = data[1],
    velocity = data[2];
  const controllerName = event.target.name;

  console.log(controllerName, channel, note, velocity);
  console.log(cmd, type);

  switch (type) {
    case definitions.noteOn:
    case definitions.noteOff:
      btnDisplay.textContent = `button value: ${velocity}`;
      faders.forEach(fader => fader.delete());
      faders = null;
      break;
    case definitions.cc:
      potDisplay.textContent = `potentiometer value: ${velocity}`;
      faders.forEach(fader => fader.update(velocity));
      break;
    default:
      null;
  }
}

function onStateChange(event) {
  if (event) {
    const port = event.port,
      state = port.state,
      name = port.name,
      type = port.type;

    console.log(`controller name: ${name}, port_type: ${type} state: ${state}`);
  }
}

function onMIDIFailure(e) {
  console.log("no access to midi, something went wrong: ", e);
}
