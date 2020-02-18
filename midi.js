import { definitions } from "./midiDefinitions.js";
import {
  faders,
  knobs,
  buttons,
  mapModeActive,
  setMapModeActive,
  selectedControl,
  setSelectedControl,
  midiMappingCreated,
  mappingTargets
} from "./dom.js";

const potDisplay = document.querySelector(".pot-val");
const btnDisplay = document.querySelector(".btn-val");

let midiMappings = [];

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

  // console.log(controllerName, channel, note, velocity);
  // console.log(cmd, type);

  if (selectedControl && mapModeActive) {
    const midiEntry = {
      note,
      name: selectedControl.id,
      value: velocity,
      deviceName: controllerName
    };

    midiMappings.push(midiEntry);
    mappingTargets.forEach(target => target.dispatchEvent(midiMappingCreated));
    setSelectedControl(null);
    setMapModeActive(false);
    console.log(midiMappings);
  }

  switch (type) {
    case definitions.noteOn:
    case definitions.noteOff:
      btnDisplay.textContent = `button value: ${velocity}`;
      linkMapToControl(midiMappings, buttons, note, velocity);
      break;
    case definitions.cc:
      potDisplay.textContent = `potentiometer value: ${velocity}`;
      linkMapToControl(midiMappings, faders, note, velocity);
      linkMapToControl(midiMappings, knobs, note, velocity);
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

function linkMapToControl(mappingArray, controlArray, note, velocity) {
  mappingArray.forEach(mapping => {
    if (mapping.note === note) {
      controlArray.forEach(c => {
        if (`${c.type}_${c.name}_${c.index}` === mapping.name) {
          c.update(velocity);
          mapping.value = velocity;
        }
      });
    }
  });
}
