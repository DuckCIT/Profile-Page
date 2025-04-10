/*************************************************
* DUCK CIT - Sparkly text animation setup
*************************************************/

let sheet;
let sparkleTemplate;

const supportsConstructableStylesheets = "replaceSync" in CSSStyleSheet.prototype;
const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)");

// Custom element for sparkly text effect
class SparklyText extends HTMLElement {
  #numberOfSparkles = 3;
  #sparkleSvg = `<svg fill="none" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="m25.4457 43.9536c-.4589 1.3952-2.4325 1.3952-2.8914 0l-2.6595-8.0867c-1.208-3.6729-4.0888-6.5537-7.7617-7.7617l-8.08672-2.6595c-1.39517-.4589-1.39517-2.4325 0-2.8914l8.08672-2.6595c3.6729-1.208 6.5537-4.0888 7.7617-7.7617l2.6595-8.08672c.4589-1.39517 2.4325-1.39517 2.8914 0l2.6595 8.08672c1.208 3.6729 4.0888 6.5537 7.7617 7.7617l8.0867 2.6595c1.3952.4589 1.3952 2.4325 0 2.8914l-8.0867 2.6595c-3.6729 1.208-6.5537 4.0888-7.7617 7.7617z"/></svg>`;

  #css = `
    :host {
      --_sparkle-base-size: var(--sparkly-text-size, 1em);
      --_sparkle-base-animation-length: var(--sparkly-text-animation-length, 1s);
      position: relative;
      z-index: 0;
    }

    svg {
      position: absolute;
      z-index: 1;
      transform-origin: center;
      pointer-events: none;
    }

    @media (prefers-reduced-motion: no-preference) {
      svg {
        animation: sparkle-spin var(--_sparkle-base-animation-length) linear infinite;
      }
    }

    @keyframes sparkle-spin {
      0% { scale: 0; opacity: 0; rotate: 0deg; }
      50% { scale: 1; opacity: 1; }
      100% { scale: 0; opacity: 0; rotate: 180deg; }
    }
  `;

  // Register custom element
  static register() {
    if ("customElements" in window) {
      window.customElements.define("sparkly-text", SparklyText);
    }
  }

  // Generate and apply CSS styles
  generateCss() {
    if (!sheet) {
      if (supportsConstructableStylesheets) {
        sheet = new CSSStyleSheet();
        sheet.replaceSync(this.#css);
      } else {
        sheet = document.createElement("style");
        sheet.textContent = this.#css;
      }
    }

    if (supportsConstructableStylesheets) {
      this.shadowRoot.adoptedStyleSheets = [sheet];
    } else {
      this.shadowRoot.append(sheet.cloneNode(true));
    }
  }

  // Initialize component
  connectedCallback() {
    const needsSparkles = motionOK.matches || !this.shadowRoot;

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.generateCss();
      this.shadowRoot.append(document.createElement("slot"));
    }

    if (needsSparkles) {
      this.#numberOfSparkles = parseInt(
        this.getAttribute("number-of-sparkles") || `${this.#numberOfSparkles}`,
        10
      );

      if (Number.isNaN(this.#numberOfSparkles)) {
        throw new Error(`Invalid number-of-sparkles value`);
      }
      this.addSparkles();
    }

    motionOK.addEventListener("change", this.motionOkChange);
    window.addEventListener("popstate", this.handleNavigation);
    window.addEventListener("pageshow", this.handlePageShow);
    this.setupObservers();
  }

  // Clean up event listeners
  disconnectedCallback() {
    motionOK.removeEventListener("change", this.motionOkChange);
    window.removeEventListener("popstate", this.handleNavigation);
    window.removeEventListener("pageshow", this.handlePageShow);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }

  // Handle navigation events
  handleNavigation = () => {
    if (motionOK.matches && !document.hidden && this.#isVisible) {
      this.resumeSparkles();
    } else {
      this.pauseSparkles();
    }
  };

  // Handle page show events
  handlePageShow = (event) => {
    if (event.persisted && motionOK.matches && !document.hidden && this.#isVisible) {
      this.resumeSparkles();
    } else {
      this.pauseSparkles();
    }
  };

  // Pause sparkle animations
  pauseSparkles() {
    const sparkles = this.shadowRoot.querySelectorAll('svg');
    sparkles.forEach(sparkle => {
      sparkle.style.animationPlayState = 'paused';
    });
  }

  // Resume sparkle animations
  resumeSparkles() {
    const sparkles = this.shadowRoot.querySelectorAll('svg');
    sparkles.forEach(sparkle => {
      sparkle.style.animationPlayState = 'running';
    });
  }

  // Handle motion preference changes
  motionOkChange = () => {
    if (motionOK.matches && !document.hidden && this.#isVisible) {
      this.addSparkles();
    } else {
      this.pauseSparkles();
    }
  };

  // Setup visibility observers
  #isVisible = false;
  setupObservers() {
    const observer = new IntersectionObserver((entries) => {
      this.#isVisible = entries[0].isIntersecting;
      if (this.#isVisible && !document.hidden && motionOK.matches) {
        this.resumeSparkles();
      } else {
        this.pauseSparkles();
      }
    }, { threshold: 0 });
    observer.observe(this);

    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  // Handle visibility changes
  handleVisibilityChange = () => {
    if (!document.hidden && this.#isVisible && motionOK.matches) {
      this.resumeSparkles();
    } else {
      this.pauseSparkles();
    }
  };

  // Add sparkles to text
  addSparkles() {
    for (let i = 0; i < this.#numberOfSparkles; i++) {
      setTimeout(() => {
        if (!document.hidden && this.#isVisible) {
          this.addSparkle(sparkle => {
            sparkle.style.top = `calc(${Math.random() * 110 - 5}% - var(--_sparkle-base-size) / 2)`;
            sparkle.style.left = `calc(${Math.random() * 110 - 5}% - var(--_sparkle-base-size) / 2)`;
          });
        }
      }, i * 200);
    }
  }

  // Create and add individual sparkle
  addSparkle(update) {
    if (!sparkleTemplate) {
      const span = document.createElement("span");
      span.innerHTML = this.#sparkleSvg;
      sparkleTemplate = span.firstElementChild.cloneNode(true);
    }

    const sparkleWrapper = sparkleTemplate.cloneNode(true);
    const colors = ['#FF6EC7', '#4285F4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sparkleWrapper.querySelector('path').setAttribute('fill', randomColor);
    const randomSize = (Math.random() * 1.0 + 1) + 'rem';
    sparkleWrapper.style.width = randomSize;
    sparkleWrapper.style.height = randomSize;
    
    update(sparkleWrapper);
    this.shadowRoot.appendChild(sparkleWrapper);
    sparkleWrapper.addEventListener("animationiteration", () => {
      const newRandomColor = colors[Math.floor(Math.random() * colors.length)];
      sparkleWrapper.querySelector('path').setAttribute('fill', newRandomColor);
      const newRandomSize = (Math.random() * 1.0 + 1) + 'rem';
      sparkleWrapper.style.width = newRandomSize;
      sparkleWrapper.style.height = newRandomSize;
      update(sparkleWrapper);
    });
  }
}

SparklyText.register();

export { SparklyText };
