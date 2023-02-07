import AnimationElement from "./animation-element.js";

class ProgressBar extends AnimationElement {
  
  #parent;
  #bar;
  #progress = 1;
  #barWidth = 400;
  #defaultProgressColor = "rgb(43, 194, 83)";
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }

  /**
   * Renders Progress bar to screen
   * @property {function} render
   * @member {Object} Progressbar
   * @returns {void}
   *
   */
  render() {
    this.shadowRoot.innerHTML = "";
    const style = document.createElement("style");
    style.innerHTML = `
           .candystriped > div:after{
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-image: linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.2) 25%,
              transparent 25%,
              transparent 50%,
              rgba(255, 255, 255, 0.2) 50%,
              rgba(255, 255, 255, 0.2) 75%,
              transparent 75%,
              transparent
            );
            z-index: 1;
            background-size: 50px 50px;
            animation: move 2s linear infinite;
            
           }

           .shiny > div:after{
            content: "";
            position: absolute;
            top: 0;
            left: -90%;
            bottom: 0;
            right: 0;
            background: -webkit-gradient(linear, left top, right top, color-stop(0%,rgba(255,255,255,0)), color-stop(50%,rgba(255,255,255,1)), color-stop(99%,rgba(255,255,255,0)), color-stop(100%,rgba(125,185,232,0)));
            width:100%;
            background-repeat: no-repeat;
            z-index: 1;
            transform: skewX(-25deg);
            animation: slide 8s ease-in 4s infinite;
          }
            
           
           @keyframes move {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 50px 50px;
            }
          }

          @keyframes slide {
            0%, 20% ,60%{
              opacity:1;
              left: -90%;
             
            }
           
            
            100% {
              opacity:0;
              left:45%;
            }
            
          }
        `;
    this.shadowRoot.append(style);

    this.#parent = document.createElement("div");
    this.#bar = document.createElement("div");
    this.#parent.style.width = `${
      parseInt(this.getAttribute("width")) || this.#barWidth
    }px`;

    let variant = this.getAttribute("variant");

    if (variant === "shiny") {
      this.#parent.classList.add("shiny");
    }
    if (variant === "candystriped") {
      this.#parent.classList.add("candystriped");
    }

    this.#parent.style.height = "20px";
    this.#parent.style.position = "relative";
    this.#parent.style.borderRadius = "20px";
    this.#parent.style.overflow = "hidden";
    this.#parent.style.backgroundColor= "#F5F5F5";
    this.#parent.style.boxShadow="inset 0 2px 9px rgb(245 245 245 / 60%), inset 0 -2px 9px rgb(0 0 0 / 10%)";

    this.#bar.style.position = "absolute";
    this.#bar.style.width = "0%";
    this.#bar.style.top = "0px";
    this.#bar.style.left = "-20px";
    this.#bar.style.height = "100%";
    this.#bar.style.transition= `${this.animationSpeed/1000 + 0.2*Math.random()}s linear`;
   
    this.#bar.style.backgroundColor =
      this.getAttribute("progress-color") || this.#defaultProgressColor;
    this.#bar.style.borderRadius = "inherit";
   
    this.#parent.append(this.#bar);
    this.shadowRoot.append(this.#parent);
  }

  /**
   * Animates ProgressBar object
   * @property {function} animate
   * @member {Object} ProgressBar
   * @returns {void} Displays ProgressBar
   */
  animate() {
    let final = 12;
    let progAttr = parseInt(this.getAttribute("progress"));
    if (progAttr) {
      final = (progAttr / 100) * final;
    }
    if (this.#progress < final) {
      this.#bar.style.width = `${this.#progress * 10}%`;
      this.enableAnimation();
    } else {
      this.disableAnimation();
    }
    this.#progress++;
  }

  /**
   * Resets ProgressBar object
   * @property {function} reset
   * @member {Object}
   */
  reset() {}
}
customElements.define("progress-bar-element", ProgressBar);
