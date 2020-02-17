import { Fader, Knob, Button } from "./uiComponents.js";

const addFaderBtn = document.querySelector(".add-btn");
const removeFaderBtn = document.querySelector(".remove-btn");
let faders = [];

addFaderBtn.addEventListener("click", () => {
  faders.push(
    new Fader({ parent: ".faders", name: "volume", index: faders.length + 1 })
  );
  faders[faders.length - 1].create();
  updateMappingTargets();
});

removeFaderBtn.addEventListener("click", () => {
  faders[faders.length - 1].delete();
  faders.pop();
  updateMappingTargets();
});

const addKnobBtn = document.querySelector(".add-knob");
const removeKnobBtn = document.querySelector(".remove-knob");
let knobs = [];

addKnobBtn.addEventListener("click", () => {
  knobs.push(
    new Knob({ parent: ".knobs", name: "eq", index: knobs.length + 1 })
  );
  knobs[knobs.length - 1].create();
  updateMappingTargets();
});

removeKnobBtn.addEventListener("click", () => {
  knobs[knobs.length - 1].delete();
  knobs.pop();
  updateMappingTargets();
});

const addButtonBtn = document.querySelector(".add-button");
const removeButtonBtn = document.querySelector(".remove-button");
let buttons = [];

addButtonBtn.addEventListener("click", () => {
  buttons.push(
    new Button({
      parent: ".buttons",
      name: "button",
      index: buttons.length + 1
    })
  );
  buttons[buttons.length - 1].create();
  updateMappingTargets();
});

removeButtonBtn.addEventListener("click", () => {
  buttons[buttons.length - 1].delete();
  buttons.pop();
  updateMappingTargets();
});

const midiMapBtn = document.querySelector(".mapMode-button");
let mappingTargets = [];
let mapModeActive = false;
let selectedControl = null;
const setMapModeActive = value => (mapModeActive = value);
const setSelectedControl = value => (selectedControl = value);
const midiMappingCreated = new Event("midiMappingCreated");

midiMapBtn.addEventListener("click", () => {
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

// @TODO - prevent duplicate eventlisteners!!!
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
