class Wrapper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
        }
      </style>
      <progress-block id="progress-block"></progress-block>
      <controls-component id="controls"></controls-component>
    `;
  }

  connectedCallback() {
    this.progressBlock = this.shadowRoot.querySelector('#progress-block');
    this.controls = this.shadowRoot.querySelector('#controls');
    this.controls.setProgressBlock(this.progressBlock);
  }
}

customElements.define('wrapper-component', Wrapper);
