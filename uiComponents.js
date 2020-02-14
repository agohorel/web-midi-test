class Control {
  constructor(props) {
    this.parent = props.parent;
    this.name = props.name;
    this.index = props.index;
    this.initialValue = 64;
    this.input = null;
    this.label = null;
    this.component = null;
    this.dragActive = false;
    this.value = this.initialValue;
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
    this.faderHandle = null;
    this.faderHeight = 200;
    this.faderWidth = 20;
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
    this.input.classList.add("hide-input");

    this.viewbox = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    this.viewbox.setAttribute("height", this.faderHeight);
    this.viewbox.addEventListener("mousedown", () => {
      this.dragActive = true;
    });
    this.viewbox.addEventListener("mouseup", () => {
      this.dragActive = false;
    });
    this.viewbox.addEventListener("mousemove", e => {
      if (this.dragActive) {
        this.value = this.map(
          e.offsetY,
          0,
          this.faderHeight,
          this.faderHeight,
          0
        );
        this.faderHandle.setAttribute("height", `${this.value}`);
      }
    });
    this.viewbox.classList.add("faderSVG");

    this.faderBackground = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    this.faderBackground.setAttribute("width", `${this.faderWidth}`);
    this.faderBackground.setAttribute("height", `${this.faderHeight}`);
    this.faderBackground.classList.add("fader-background");

    this.faderHandle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    this.faderHandle.setAttribute("y", `-${this.faderHeight}`);
    this.faderHandle.setAttribute("width", `${this.faderWidth}`);
    this.faderHandle.setAttribute(
      "height",
      `${this.map(this.initialValue, 0, 127, 0, this.faderHeight)}`
    );
    this.faderHandle.classList.add("fader-handle");

    this.viewbox.appendChild(this.faderBackground);
    this.viewbox.appendChild(this.faderHandle);

    this.component.appendChild(this.label);
    this.component.appendChild(this.input);
    this.component.appendChild(this.viewbox);

    document.querySelector(this.parent).appendChild(this.component);
  };

  update = cc => {
    this.input.value = cc;
    this.faderHandle.setAttribute(
      "height",
      `${this.map(cc, 0, 127, 0, this.faderHeight)}`
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
    this.height = 85;
    this.strokeWidth = 8;
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
    this.input.classList.add("hide-input");

    this.viewbox = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    this.viewbox.setAttribute("height", `${this.height}`);
    this.viewbox.setAttribute("width", `${this.height}`);
    this.viewbox.setAttribute("width", `${this.height}`);
    this.viewbox.addEventListener("mousedown", () => {
      this.dragActive = true;
    });
    this.viewbox.addEventListener("mouseup", () => {
      this.dragActive = false;
    });

    this.viewbox.addEventListener("mousemove", e => {
      if (this.dragActive) {
        this.value = this.map(
          e.offsetY,
          this.height,
          0,
          0,
          2 * Math.PI * (this.height / 2 - 5)
        );
        this.knobValue.setAttribute("stroke-dasharray", `${this.value}, 99999`);
      }
    });

    this.knobBackground = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    this.knobBackground.setAttribute("cx", `${this.height / 2}`);
    this.knobBackground.setAttribute("cy", `${this.height / 2}`);
    this.knobBackground.setAttribute(
      "r",
      `${this.height / 2 - this.strokeWidth}`
    );
    this.knobBackground.setAttribute("stroke-width", `${this.strokeWidth}`);
    this.knobBackground.classList.add("knob-background");

    this.knobValue = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    this.knobValue.setAttribute("cx", `${this.height / 2}`);
    this.knobValue.setAttribute("cy", `${this.height / 2}`);
    this.knobValue.setAttribute("r", `${this.height / 2 - this.strokeWidth}`);
    this.knobValue.setAttribute("stroke-width", `${this.strokeWidth}`);
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
      `${this.map(
        cc,
        0,
        127,
        0,
        2 * Math.PI * (this.height / 2 - this.strokeWidth)
      )}, 99999`
    );
  };
}

class Button extends Control {
  constructor(props) {
    super(props);
    this.type = "button";
    this.height = 40;
    this.width = 40;
    this.inset = 0.8;
    this.isActive = false;
  }

  create = () => {
    this.component = document.createElement("div");
    this.component.id = `${this.type}_${this.name}_${this.index}`;
    this.component.classList.add(this.type);

    this.label = document.createElement("label");
    this.label.textContent = `${this.type}_${this.name}_${this.index}`;

    this.input = document.createElement("input");
    this.input.type = "checkbox";
    this.input.value = this.initialValue;
    this.input.classList.add("hide-input");

    this.viewbox = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    this.viewbox.setAttribute("height", this.height);
    this.viewbox.setAttribute("width", this.width);
    this.viewbox.addEventListener("click", () => {
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
    this.buttonBackground.setAttribute("width", this.width);
    this.buttonBackground.setAttribute("height", this.height);

    this.buttonValue = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    this.buttonValue.setAttribute("width", this.width * this.inset);
    this.buttonValue.setAttribute("height", this.height * this.inset);
    this.buttonValue.style.opacity = 0;

    document.documentElement.style.setProperty(
      "--button-inset",
      `${((1 - this.inset) / 2) * 100}%`
    );

    this.buttonValue.classList.add("button-value");

    this.viewbox.appendChild(this.buttonBackground);
    this.viewbox.appendChild(this.buttonValue);

    this.component.appendChild(this.label);
    this.component.appendChild(this.input);
    this.component.appendChild(this.viewbox);

    document.querySelector(this.parent).appendChild(this.component);
  };

  update = cc => {
    this.buttonValue.style.opacity = this.map(cc, 0, 127, 0, 100);
    this.value = cc;
  };
}

export { Fader, Knob, Button };
