class Slider {
  constructor(props) {
    this.type = "slider";
    this.parent = props.parent;
    this.name = props.name;
    this.index = props.index;
    this.initialValue = 64;
    this.input = null;
    this.label = null;
    this.component = null;
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
    this.input.value = this.value;

    this.component.appendChild(this.label);
    this.component.appendChild(this.input);

    document.querySelector(this.parent).appendChild(this.component);
  };

  update = cc => {
    this.input.value = cc;
  };

  delete = () => {
    const elem = document.querySelector(`#${this.component.id}`);
    elem.parentNode.removeChild(elem);
  };
}

export default Slider;
