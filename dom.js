import { Fader, Knob, Button } from "./uiComponents.js";

const addFaderBtn = document.querySelector(".add-btn");
const removeFaderBtn = document.querySelector(".remove-btn");
let faders = [];

addFaderBtn.addEventListener("click", () => {
  faders.push(
    new Fader({ parent: ".faders", name: "volume", index: faders.length + 1 })
  );
  faders[faders.length - 1].create();
});

removeFaderBtn.addEventListener("click", () => {
  faders[faders.length - 1].delete();
  faders.pop();
});

const addKnobBtn = document.querySelector(".add-knob");
const removeKnobBtn = document.querySelector(".remove-knob");
let knobs = [];

addKnobBtn.addEventListener("click", () => {
  knobs.push(
    new Knob({ parent: ".knobs", name: "eq", index: knobs.length + 1 })
  );
  knobs[knobs.length - 1].create();
});

removeKnobBtn.addEventListener("click", () => {
  knobs[knobs.length - 1].delete();
  knobs.pop();
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
});

removeButtonBtn.addEventListener("click", () => {
  buttons[buttons.length - 1].delete();
  buttons.pop();
});

const midiMapBtn = document.querySelector(".mapMode-button");
let isMapModeActive = false;

midiMapBtn.addEventListener("click", () => {
  isMapModeActive = !isMapModeActive;
  const mappingTargets = document.querySelectorAll(".mapping-target");

  mappingTargets.forEach(target => {
    if (isMapModeActive) {
      target.classList.add("mapping-mode-active");
    } else {
      target.classList.remove("mapping-mode-active", "mapping-mode-selected");
    }

    target.addEventListener("click", () => {
      const clickedTarget = target;
      target.classList.toggle("mapping-mode-active");
      target.classList.toggle("mapping-mode-selected");

      mappingTargets.forEach(target => {
        if (target !== clickedTarget) {
          target.classList.remove("mapping-mode-selected");
          target.classList.add("mapping-mode-active");
        }
      });
    });
  });
});

export { faders, knobs, buttons };
