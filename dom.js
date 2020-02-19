import { Fader, Knob, Button } from "./uiComponents.js";

let faders = [],
  knobs = [],
  buttons = [];

createAddRemoveControls(
  document.querySelector(".add-btn"),
  document.querySelector(".remove-btn"),
  faders,
  { parent: ".faders", name: "volume" },
  Fader
);

createAddRemoveControls(
  document.querySelector(".add-knob"),
  document.querySelector(".remove-knob"),
  knobs,
  {
    parent: ".knobs",
    name: "eq"
  },
  Knob
);

createAddRemoveControls(
  document.querySelector(".add-button"),
  document.querySelector(".remove-button"),
  buttons,
  {
    parent: ".buttons",
    name: "button"
  },
  Button
);

let mappingTargets = [];
let mapModeActive = false;
let selectedControl = null;
const setMapModeActive = value => (mapModeActive = value);
const setSelectedControl = value => (selectedControl = value);
const midiMappingCreated = new Event("midiMappingCreated");

document.querySelector(".mapMode-button").addEventListener("click", () => {
  mapModeActive = !mapModeActive;

  mappingTargets.forEach(target => {
    if (mapModeActive) {
      target.classList.add("mapping-mode-active");
    } else {
      selectedControl = null;
      target.classList.remove("mapping-mode-active", "mapping-mode-selected");
    }
  });
});

function updateMappingTargets() {
  mappingTargets = document.querySelectorAll(".mapping-target");

  mappingTargets.forEach((target, i) => {
    if (mapModeActive) {
      target.classList.add("mapping-mode-active");
    } else {
      selectedControl = null;
      target.classList.remove("mapping-mode-active", "mapping-mode-selected");
    }

    if (i === mappingTargets.length - 1) {
      target.addEventListener("click", () => {
        if (mapModeActive) {
          selectedControl = target;

          target.classList.add("mapping-mode-selected");
          target.classList.remove("mapping-mode-active");

          mappingTargets.forEach(target => {
            if (target !== selectedControl) {
              target.classList.remove("mapping-mode-selected");
              target.classList.add("mapping-mode-active");
            }
          });
        }
      });
    }

    if (i === mappingTargets.length - 1) {
      target.addEventListener("midiMappingCreated", () => {
        target.classList.remove("mapping-mode-active", "mapping-mode-selected");
      });
    }
  });
}

function createAddRemoveControls(
  addBtn,
  removeBtn,
  controlsArray,
  controlParams,
  ControlClass
) {
  addBtn.addEventListener("click", () => {
    controlsArray.push(
      new ControlClass({ ...controlParams, index: controlsArray.length + 1 })
    );
    controlsArray[controlsArray.length - 1].create();
    updateMappingTargets();
  });

  removeBtn.addEventListener("click", () => {
    controlsArray[controlsArray.length - 1].delete();
    controlsArray.pop();
    updateMappingTargets();
  });
}

export {
  faders,
  knobs,
  buttons,
  mapModeActive,
  setMapModeActive,
  selectedControl,
  setSelectedControl,
  midiMappingCreated,
  mappingTargets
};
