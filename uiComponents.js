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

  createComponent = () => {
    const component = document.createElement("div");
    component.id = `${this.type}_${this.name}_${this.index}`;
    component.classList.add(this.type, "mapping-target");
    return component;
  };

  createInput = (type, initialValue, min, max) => {
    const input = document.createElement("input");
    input.type = type;
    input.value = initialValue;
    input.classList.add("hide-input");
    if (type === "range") {
      input.min = min;
      input.max = max;
    }
    return input;
  };

  createLabel = (type, name, index) => {
    const label = document.createElement("label");
    label.textContent = `${type}_${name}_${index}`;
    return label;
  };

  createSVG = (svgElement, paramsObj, className) => {
    const svg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      svgElement
    );
    Object.keys(paramsObj).forEach(param => {
      svg.setAttribute(param, paramsObj[param]);
    });
    if (className) svg.classList.add(className);
    return svg;
  };

  delete = () => {
    const elem = document.querySelector(`#${this.component.id}`);
    elem.parentNode.removeChild(elem);
  };

  map = (value, inMin, inMax, outMin, outMax) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  };

  // @desc  : prevents "sticky" mouse behavior if cursor goes outside event listener
  // @params: (event, [width, height])
  // @notes : for 1:1 aspect ratio shapes just reuse the single dimension
  boundsCheck = (e, dimensions) => {
    if (e.offsetX > dimensions[0] - 2 || e.offsetX < 2) {
      this.isDraggable = false;
    }
    if (e.offsetY > dimensions[1] - 2 || e.offsetY < 2) {
      this.isDraggable = false;
    }
  };

  addMouseEventListeners = element => {
    element.addEventListener("mousedown", () => {
      this.isDraggable = true;
    });
    element.addEventListener("mouseup", () => {
      this.isDraggable = false;
    });
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
    this.component = this.createComponent();

    this.label = this.createLabel(this.type, this.name, this.index);

    this.input = this.createInput(
      "range",
      this.initialValue,
      this.minValue,
      this.maxValue
    );

    this.svg = this.createSVG(
      "svg",
      { width: this.width, height: this.height },
      "faderSVG"
    );

    this.addMouseEventListeners(this.svg);

    this.svg.addEventListener("mousemove", e => {
      if (this.isDraggable) {
        this.value = this.map(e.offsetY, 0, this.height - 1, this.height, 0);
        this.faderValue.setAttribute("height", `${this.value}`);
        this.boundsCheck(e, [this.width, this.height]);
      }
    });

    this.faderBackground = this.createSVG(
      "rect",
      { width: this.width, height: this.height },
      "fader-background"
    );

    this.faderValue = this.createSVG(
      "rect",
      {
        width: this.width,
        height: `${this.map(this.initialValue, 0, 127, 0, this.height)}`,
        y: `-${this.height}`
      },
      "fader-handle"
    );

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
    this.component = this.createComponent();

    this.label = this.createLabel(this.type, this.name, this.index);

    this.input = this.createInput(
      "range",
      this.initialValue,
      this.minValue,
      this.maxValue
    );

    this.svg = this.createSVG("svg", {
      width: this.diameter,
      height: this.diameter
    });

    this.addMouseEventListeners(this.svg);

    this.svg.addEventListener("mousemove", e => {
      if (this.isDraggable) {
        this.value = this.map(
          e.offsetY,
          this.diameter - 1,
          0,
          0,
          2 * Math.PI * (this.diameter / 2 - 5)
        );
        this.knobValue.setAttribute("stroke-dasharray", `${this.value}, 99999`);
        this.boundsCheck(e, [this.diameter, this.diameter]);
      }
    });

    this.knobBackground = this.createSVG(
      "circle",
      {
        cx: this.diameter / 2,
        cy: this.diameter / 2,
        r: this.diameter / 2 - this.strokeWidth,
        "stroke-width": this.strokeWidth
      },
      "knob-background"
    );

    this.knobValue = this.createSVG(
      "circle",
      {
        cx: this.diameter / 2,
        cy: this.diameter / 2,
        r: this.diameter / 2 - this.strokeWidth,
        "stroke-width": this.strokeWidth,
        "stroke-dasharray": this.map(
          this.value,
          0,
          127,
          0,
          2 * Math.PI * (this.diameter / 2 - this.strokeWidth)
        )
      },
      "knob-value"
    );

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
    this.component = this.createComponent();

    this.label = this.createLabel(this.type, this.name, this.index);

    this.input = this.createInput("checkbox", this.initialValue);

    this.svg = this.createSVG("svg", {
      width: this.length,
      height: this.length
    });

    this.svg.addEventListener("click", () => {
      this.toggleButtonState();
    });

    this.buttonBackground = this.createSVG("rect", {
      width: this.length,
      height: this.length
    });

    this.buttonValue = this.createSVG(
      "rect",
      {
        width: this.length * this.inset,
        height: this.length * this.inset
      },
      "button-value"
    );

    this.buttonValue.style.opacity = 0;

    document.documentElement.style.setProperty(
      "--button-inset",
      `${((1 - this.inset) / 2) * 100}%`
    );

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
    if (this.value === 0) this.isActive = false;
  };

  toggleButtonState = () => {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.buttonValue.style.opacity = 100;
      this.value = 127;
    } else {
      this.buttonValue.style.opacity = 0;
      this.value = 0;
    }
  };
}

export { Fader, Knob, Button };
