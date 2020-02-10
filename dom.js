import { Fader, Knob } from "./uiComponents.js";

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
    new Knob({ parent: ".knobs", name: "eq", index: faders.length + 1 })
  );
  knobs[knobs.length - 1].create();
});

removeKnobBtn.addEventListener("click", () => {
  knobs[knobs.length - 1].delete();
  knobs.pop();
});

export { faders, knobs };
