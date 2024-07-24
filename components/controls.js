class Controls extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px;
          border-radius: 8px;
          background-color: #ccc;
        }

        .controls-content > div {
          display: flex;
          flex-wrap: wrap-reverse;
          gap: 8px;
          align-items: center;
          justify-content: space-between;
        }

        .controls-content label {
          font-size: small;
        }

        :host input::-webkit-inner-spin-button {
          display: none;
        }

        :host input[type='number'] {
          font-family: inherit;
          background-color: transparent;
          border: 1px solid currentColor;
          width: 100px;
          padding: 4px;
          border-radius: 4px;
          text-align: center;
          text-overflow: ellipsis;
        }

        :host input[type="color"] {
          -webkit-appearance: none;
          border: none;
        }

        :host input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
        }

        :host input[type="color"]::-webkit-color-swatch {
          border: none;
        }

        :host input[type="color" i] {
          padding: 4px;
          border-radius: 4px;
          background-color: currentColor;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .input-wrapper button {
          width: 24px;
          height: 24px;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          vertical-align: middle;
          border: none;
          background-color: #4caf50;
          border-radius: 4px;
          color: currentColor;
          cursor: pointer;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .controls-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .toggle-button {
          background: none;
          border: none;
          cursor: pointer;
        }

        .controls-content.collapsed {
          display: none;
        }

        .rotate svg {
          transform: rotate(180deg);
        }
        
        svg {
          transition: transform 150ms;
        }
        
        h4 {
          margin: 0;
        }
      </style>
      <div class="header">
        <h4>Controls</h4>
        <button class="toggle-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 9s-4.419 6-6 6s-6-6-6-6" color="currentColor"/></svg>
        </button>
      </div>
      <div class="controls-content">
        <div>
          <div class="input-wrapper">
            <button id="value-decrease">-</button>
            <input type="number" id="value-input" min="0" max="100" value="0" />
            <button id="value-increase">+</button>
          </div>
          <label for="value-input">Value</label>
        </div>
        <div>
          <div class="input-wrapper">
            <button id="size-decrease">-</button>
            <input type="number" id="size-input" min="10" value="100" step="10" />
            <button id="size-increase">+</button>
          </div>
          <label for="size-input">Size</label>
        </div>
        <div>
          <input type="color" id="circle-color-input" value="#cccccc" />
          <label for="circle-color-input">Circle Color</label>
        </div>
        <div>
          <input type="color" id="path-color-input" value="#4caf50" />
          <label for="path-color-input">Progress Color</label>
        </div>
        <div>
          <input type="checkbox" id="animate-toggle" />
          <label for="animate-toggle">Animate</label>
        </div>
        <div>
          <input type="checkbox" id="hide-toggle" />
          <label for="hide-toggle">Hide</label>
        </div>
        <div class="position-wrapper">
          <label for="position-select">Position</label>
          <select id="position-select">
            <option value="default">Default</option>
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.valueInput = this.shadowRoot.querySelector('#value-input');
    this.sizeInput = this.shadowRoot.querySelector('#size-input');
    this.circleColorInput = this.shadowRoot.querySelector(
      '#circle-color-input'
    );
    this.pathColorInput = this.shadowRoot.querySelector('#path-color-input');
    this.animateToggle = this.shadowRoot.querySelector('#animate-toggle');
    this.hideToggle = this.shadowRoot.querySelector('#hide-toggle');
    this.positionSelect = this.shadowRoot.querySelector('#position-select');
    this.toggleButton = this.shadowRoot.querySelector('.toggle-button');
    this.controlsContent = this.shadowRoot.querySelector('.controls-content');

    this.shadowRoot
      .querySelector('#value-decrease')
      .addEventListener('click', this.decreaseValue.bind(this));
    this.shadowRoot
      .querySelector('#value-increase')
      .addEventListener('click', this.increaseValue.bind(this));
    this.shadowRoot
      .querySelector('#size-decrease')
      .addEventListener('click', this.decreaseSize.bind(this));
    this.shadowRoot
      .querySelector('#size-increase')
      .addEventListener('click', this.increaseSize.bind(this));

    this.valueInput.addEventListener('input', this.handleValueInput.bind(this));
    this.sizeInput.addEventListener('input', this.handleSizeInput.bind(this));
    this.circleColorInput.addEventListener(
      'input',
      this.handleCircleColorInput.bind(this)
    );
    this.pathColorInput.addEventListener(
      'input',
      this.handlePathColorInput.bind(this)
    );
    this.animateToggle.addEventListener(
      'change',
      this.handleAnimateToggle.bind(this)
    );
    this.hideToggle.addEventListener(
      'change',
      this.handleHideToggle.bind(this)
    );
    this.positionSelect.addEventListener(
      'change',
      this.handlePositionChange.bind(this)
    );
    this.toggleButton.addEventListener('click', this.toggleCollapse.bind(this));
  }

  setProgressBlock(progressBlock) {
    this.progressBlock = progressBlock;
  }

  handleValueInput(event) {
    const value = Math.max(
      0,
      Math.min(100, parseInt(event.target.value, 10) || 0)
    );
    event.target.value = value;
    if (this.progressBlock) {
      this.progressBlock.updateProgress(value);
    }
  }

  handleSizeInput(event) {
    const size = Math.max(0, parseInt(event.target.value, 10) || 0);

    event.target.value = size;
    if (this.progressBlock) {
      this.progressBlock.updateSize(size);
    }
  }

  handleCircleColorInput(event) {
    if (this.progressBlock) {
      this.progressBlock.updateCircleColor(event.target.value);
    }
  }

  handlePathColorInput(event) {
    if (this.progressBlock) {
      this.progressBlock.updatePathColor(event.target.value);
    }
  }

  handleAnimateToggle(event) {
    if (this.progressBlock) {
      this.progressBlock.toggleAnimation(event.target.checked);
    }
  }

  handleHideToggle(event) {
    if (this.progressBlock) {
      this.progressBlock.style.display = event.target.checked ? 'none' : '';
    }
  }

  handlePositionChange(event) {
    const position = event.target.value;
    this.style.position = position === 'default' ? 'static' : 'fixed';

    switch (position) {
      case 'top-left':
        this.style.top = '0';
        this.style.left = '0';
        this.style.right = '';
        this.style.bottom = '';
        break;
      case 'top-right':
        this.style.top = '0';
        this.style.right = '0';
        this.style.left = '';
        this.style.bottom = '';
        break;
      case 'bottom-left':
        this.style.bottom = '0';
        this.style.left = '0';
        this.style.right = '';
        this.style.top = '';
        break;
      case 'bottom-right':
        this.style.bottom = '0';
        this.style.right = '0';
        this.style.left = '';
        this.style.top = '';
        break;
      default:
        this.style.top = '';
        this.style.right = '';
        this.style.bottom = '';
        this.style.left = '';
    }
  }

  toggleCollapse() {
    this.controlsContent.classList.toggle('collapsed');
    this.toggleButton.classList.toggle('rotate');
  }

  decreaseValue() {
    this.valueInput.value = Math.max(
      0,
      parseInt(this.valueInput.value, 10) - 1
    );
    this.handleValueInput({ target: this.valueInput });
  }

  increaseValue() {
    this.valueInput.value = Math.min(
      100,
      parseInt(this.valueInput.value, 10) + 1
    );
    this.handleValueInput({ target: this.valueInput });
  }

  decreaseSize() {
    this.sizeInput.value = Math.max(
      10,
      parseInt(this.sizeInput.value, 10) - 10
    );
    this.handleSizeInput({ target: this.sizeInput });
  }

  increaseSize() {
    this.sizeInput.value = parseInt(this.sizeInput.value, 10) + 10;
    this.handleSizeInput({ target: this.sizeInput });
  }
}

customElements.define('controls-component', Controls);
