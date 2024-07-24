class ProgressBlock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
            
          :host svg {
            display: block;
          }

          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          :host .rotate {
            animation: rotate 2s linear infinite;
            transform-origin: center;
          }
        </style>
          <svg id="progress-svg" width="100" height="100" viewBox="0 0 100 100">
            <circle id="background-circle" cx="50" cy="50" r="45" stroke="#ccc" stroke-width="10" fill="none" />
            <path id="progress-path" d="" stroke="#4caf50" stroke-width="10" fill="none" />
          </svg>
      `;

    this.progressValue = 0;
  }

  connectedCallback() {
    this.updateSize(100);
    this.updateProgress(this.progressValue);
    this.updateCircleColor('#cccccc');
    this.updatePathColor('#4caf50');
  }

  updateProgress(value) {
    this.progressValue = value;
    const angle = (value / 100) * 360;
    const size = this.shadowRoot
      .querySelector('#progress-svg')
      .getAttribute('width');
    const radius = size * 0.45;
    const center = size / 2;
    const radians = (angle - 90) * (Math.PI / 180);
    const x = center + radius * Math.cos(radians);
    const y = center + radius * Math.sin(radians);
    const largeArcFlag = value > 50 ? 1 : 0;
    const pathData =
      value === 100
        ? `M ${center} ${
            center - radius
          } A ${radius} ${radius} 0 1 1 ${center} ${
            center + radius
          } A ${radius} ${radius} 0 1 1 ${center} ${center - radius}`
        : `M ${center} ${
            center - radius
          } A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x} ${y}`;
    this.shadowRoot.querySelector('#progress-path').setAttribute('d', pathData);
  }

  updateSize(size) {
    const radius = size * 0.45;
    const center = size / 2;
    const svg = this.shadowRoot.querySelector('#progress-svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    const circle = this.shadowRoot.querySelector('#background-circle');
    circle.setAttribute('cx', center);
    circle.setAttribute('cy', center);
    circle.setAttribute('r', radius);
    const strokeWidth = size * 0.1;
    circle.setAttribute('stroke-width', strokeWidth);
    this.shadowRoot
      .querySelector('#progress-path')
      .setAttribute('stroke-width', strokeWidth);
    this.updateProgress(this.progressValue);
  }

  updateCircleColor(color) {
    this.shadowRoot
      .querySelector('#background-circle')
      .setAttribute('stroke', color);
  }

  updatePathColor(color) {
    this.shadowRoot
      .querySelector('#progress-path')
      .setAttribute('stroke', color);
  }

  toggleAnimation(animate) {
    this.shadowRoot
      .querySelector('#progress-path')
      .classList.toggle('rotate', animate);
  }
}

customElements.define('progress-block', ProgressBlock);
