class Control {
  constructor(props) {
    this.parent = props.parent;
    this.component = null;
    this.label = null;
    this.input = null;
    this.name = props.name;
    this.index = props.index;
    this.initialValue = 64;
    this.minValue = 0;
    this.maxValue = 127;
    this.value = this.initialValue;
    this.isDraggable = false;
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
    this.faderBackground = null;
    this.faderValue = null;
    this.height = 200;
    this.width = 20;
  }

  create = () => {
    this.component = document.createElement("div");
    this.component.id = `${this.type}_${this.name}_${this.index}`;
    this.component.classList.add(this.type);

    this.label = createLabel(this.type, this.name, this.index);

    this.input = createInput(
      "range",
      this.initialValue,
      this.minValue,
      this.maxValue
    );

    this.svg = createSVG(this.width, this.height);

    this.svg.addEventListener("mousedown", () => {
      this.isDraggable = true;
    });
    this.svg.addEventListener("mouseup", () => {
      this.isDraggable = false;
    });
    this.svg.addEventListener("mousemove", e => {
      if (this.isDraggable) {
        this.value = this.map(e.offsetY, 0, this.height, this.height, 0);
        this.faderValue.setAttribute("height", `${this.value}`);
      }
    });
    this.svg.classList.add("faderSVG");

    this.faderBackground = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    this.faderBackground.setAttribute("width", `${this.width}`);
    this.faderBackground.setAttribute("height", `${this.height}`);
    this.faderBackground.classList.add("fader-background");

    this.faderValue = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    this.faderValue.setAttribute("y", `-${this.height}`);
    this.faderValue.setAttribute("width", `${this.width}`);
    this.faderValue.setAttribute(
      "height",
      `${this.map(this.initialValue, 0, 127, 0, this.height)}`
    );
    this.faderValue.classList.add("fader-handle");

    this.svg.appendChild(this.faderBackground);
    this.svg.appendChild(this.faderValue);

    this.component.appendChild(this.label);
    this.component.appendChild(this.input);
    this.component.appendChild(this.svg);

    document.querySelector(this.parent).appendChild(this.component);
  };

  update = cc => {
    this.input.value = cc;
    this.faderValue.setAttribute(
      "height",
      `${this.map(cc, 0, 127, 0, this.height)}`
    );
  };
}

class Knob extends Control {
  constructor(props) {
    super(props);
    this.type = "knob";
    this.svg = null;
    this.knobBackground = null;
    this.knobValue = null;
    this.diameter = 85;
    this.strokeWidth = 8;
  }

  create = () => {
    this.component = document.createElement("div");
    this.component.id = `${this.type}_${this.name}_${this.index}`;
    this.component.classList.add(this.type);

    this.label = createLabel(this.type, this.name, this.index);

    this.input = createInput(
      "range",
      this.initialValue,
      this.minValue,
      this.maxValue
    );

    this.svg = createSVG(this.diameter, this.diameter);
    this.svg.addEventListener("mousedown", () => {
      this.isDraggable = true;
    });
    this.svg.addEventListener("mouseup", () => {
      this.isDraggable = false;
    });
    this.svg.addEventListener("mousemove", e => {
      if (this.isDraggable) {
        this.value = this.map(
          e.offsetY,
          this.diameter,
          0,
          0,
          2 * Math.PI * (this.diameter / 2 - 5)
        );
        this.knobValue.setAttribute("stroke-dasharray", `${this.value}, 99999`);
      }
    });

    this.knobBackground = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    this.knobBackground.setAttribute("cx", `${this.diameter / 2}`);
    this.knobBackground.setAttribute("cy", `${this.diameter / 2}`);
    this.knobBackground.setAttribute(
      "r",
      `${this.diameter / 2 - this.strokeWidth}`
    );
    this.knobBackground.setAttribute("stroke-width", `${this.strokeWidth}`);
    this.knobBackground.classList.add("knob-background");

    this.knobValue = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    this.knobValue.setAttribute("cx", `${this.diameter / 2}`);
    this.knobValue.setAttribute("cy", `${this.diameter / 2}`);
    this.knobValue.setAttribute("r", `${this.diameter / 2 - this.strokeWidth}`);
    this.knobValue.setAttribute("stroke-width", `${this.strokeWidth}`);
    this.knobValue.setAttribute(
      "stroke-dasharray",
      `${this.map(
        this.value,
        0,
        127,
        0,
        2 * Math.PI * (this.diameter / 2 - this.strokeWidth)
      )}, 99999`
    );
    this.knobValue.classList.add("knob-value");

    this.svg.appendChild(this.knobBackground);
    this.svg.appendChild(this.knobValue);

    this.component.appendChild(this.label);
    this.component.appendChild(this.input);
    this.component.appendChild(this.svg);

    document.querySelector(this.parent).appendChild(this.component);
  };

  update = cc => {
    this.input.value = cc;
    this.knobValue.setAttribute(
      "stroke-dasharray",
      `${this.map(
        cc,
        0,
        127,
        0,
        2 * Math.PI * (this.diameter / 2 - this.strokeWidth)
      )}, 99999`
    );
  };
}

class Button extends Control {
  constructor(props) {
    super(props);
    this.type = "button";
    this.length = 40;
    this.inset = 0.8;
    this.isActive = false;
  }

  create = () => {
    this.component = document.createElement("div");
    this.component.id = `${this.type}_${this.name}_${this.index}`;
    this.component.classList.add(this.type);

    this.label = createLabel(this.type, this.name, this.index);

    this.input = createInput("checkbox", this.initialValue);

    this.svg = createSVG(this.length, this.length);
    this.svg.addEventListener("click", () => {
      this.isActive = !this.isActive;
      if (this.isActive) {
        this.buttonValue.style.opacity = 100;
        this.value = 127;
      } else {
        this.buttonValue.style.opacity = 0;
        this.value = 0;
      }
    });

    this.buttonBackground = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    this.buttonBackground.setAttribute("width", this.length);
    this.buttonBackground.setAttribute("height", this.length);

    this.buttonValue = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    this.buttonValue.setAttribute("width", this.length * this.inset);
    this.buttonValue.setAttribute("height", this.length * this.inset);
    this.buttonValue.style.opacity = 0;

    document.documentElement.style.setProperty(
      "--button-inset",
      `${((1 - this.inset) / 2) * 100}%`
    );

    this.buttonValue.classList.add("button-value");

    this.svg.appendChild(this.buttonBackground);
    this.svg.appendChild(this.buttonValue);

    this.component.appendChild(this.label);
    this.component.appendChild(this.input);
    this.component.appendChild(this.svg);

    document.querySelector(this.parent).appendChild(this.component);
  };

  update = cc => {
    this.buttonValue.style.opacity = this.map(cc, 0, 127, 0, 100);
    this.value = cc;
  };
}

export { Fader, Knob, Button };

function createInput(type, initialValue, min, max) {
  const input = document.createElement("input");
  input.type = type;
  input.value = initialValue;
  input.classList.add("hide-input");
  if (type === "range") {
    input.min = min;
    input.max = max;
  }
  return input;
}

function createLabel(type, name, index) {
  const label = document.createElement("label");
  label.textContent = `${type}_${name}_${index}`;
  return label;
}

function createSVG(width, height) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", `${width}`);
  svg.setAttribute("height", `${height}`);
  return svg;
}
