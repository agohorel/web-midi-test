class Control {
  constructor(props) {
    this.parent = props.parent;
    this.name = props.name;
    this.index = props.index;
    this.initialValue = 64;
    this.input = null;
    this.label = null;
    this.component = null;
  }

  delete = () => {
    const elem = document.querySelector(`#${this.component.id}`);
    elem.parentNode.removeChild(elem);
  };

  map = (value, inMin, inMax, outMin, outMax) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  };
}

class Fader extends Control {
  constructor(props) {
    super(props);
    this.type = "fader";
  }

  create = () => {
    this.component = document.createElement("div");
    this.component.id = `${this.type}_${this.name}_${this.index}`;
    this.component.classList.add(this.type);

    this.label = document.createElement("label");
    this.label.textContent = `${this.type}_${this.name}_${this.index}`;

    this.input = document.createElement("input");
    this.input.type = "range";
    this.input.min = 0;
    this.input.max = 127;
    this.input.value = this.initialValue;

    this.component.appendChild(this.label);
    this.component.appendChild(this.input);

    document.querySelector(this.parent).appendChild(this.component);
  };

  update = cc => {
    this.input.value = cc;
    document.documentElement.style.setProperty(
      "--fader-background",
      `rgb(${cc}, ${cc}, ${cc})`
    );
  };
}

class Knob extends Control {
  constructor(props) {
    super(props);
    this.type = "knob";
    this.viewbox = null;
    this.knobBackground = null;
    this.knobValue = null;
    this.value = this.initialValue;
    this.dragActive = false;
  }

  create = () => {
    this.component = document.createElement("div");
    this.component.id = `${this.type}_${this.name}_${this.index}`;

    this.label = document.createElement("label");
    this.label.textContent = `${this.type}_${this.name}_${this.index}`;

    this.input = document.createElement("input");
    this.input.type = "range";
    this.input.min = 0;
    this.input.max = 127;
    this.input.value = this.initialValue;
    this.input.classList.add("knob-input");

    this.viewbox = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    this.viewbox.setAttribute("viewBox", "0 0 60 60");
    this.viewbox.addEventListener("mousedown", () => {
      this.dragActive = true;
    });
    this.viewbox.addEventListener("mouseup", () => {
      this.dragActive = false;
    });
    this.viewbox.addEventListener("mousemove", e => {
      if (this.dragActive) {
        this.value = this.map(e.clientY, 294, 210, 0, 170);
        this.knobValue.setAttribute("stroke-dasharray", `${this.value}, 99999`);
      }
    });

    this.knobBackground = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    this.knobBackground.setAttribute("cx", "30");
    this.knobBackground.setAttribute("cy", "30");
    this.knobBackground.setAttribute("r", "27");
    this.knobBackground.classList.add("knob-background");

    this.knobValue = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    this.knobValue.setAttribute("cx", "30");
    this.knobValue.setAttribute("cy", "30");
    this.knobValue.setAttribute("r", "27");
    this.knobValue.classList.add("knob-value");

    this.viewbox.appendChild(this.knobBackground);
    this.viewbox.appendChild(this.knobValue);

    this.component.appendChild(this.label);
    this.component.appendChild(this.input);
    this.component.appendChild(this.viewbox);

    document.querySelector(this.parent).appendChild(this.component);
  };

  update = cc => {
    this.input.value = cc;
    this.knobValue.setAttribute(
      "stroke-dasharray",
      `${this.map(cc, 0, 127, 0, 170)}, 99999`
    );
  };
}

export { Fader, Knob };
