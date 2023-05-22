import AnimationElement from "./animation-element.js";
/**
 * @class 
 * @classdesc Create a Text Shadow Element
 * 
 */
class TextShadowElement extends AnimationElement {
    /**
     * @type {Object<String, Array<Function>>}
     */
    #eventListeners = {};
  
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.color = this.getAttribute("color") || null;
    }
    
    connectedCallback() {
      this.render();
    }
    /**
     * @property {function} render
     * @member {Object} TextShadowElement
     * @returns {void} Prints out TextShadowElement object
     * 
     */
    render() {
      this.shadowRoot.innerHTML = "";
      const style = document.createElement("style");
      style.innerHTML = `
        :host {
          display: inline-block;
          position: absolute;
          width: 100px;
          height: 100px;
          font-size: 30px;
          top = 0px;
          color: ${this.color || 'white'};
          transition: ${this.animationSpeed/1000 + 0.2*Math.random()}s linear;
          animation: textShadowAnimation 2s infinite;
        }
        
        @keyframes textShadowAnimation {
          0% {
            text-shadow: 0 10px 0px rgba(255, 235, 0, 1);
          }
          
          50% {
            text-shadow: 2px 10px 4px rgba(41, 150, 23, 1);
          }
          
          100% {
            text-shadow: 0 0 0 rgba(245, 40, 145, 0.8);
          }
        }
      `;
      this.shadowRoot.append(style);
      this.shadowRoot.append(document.createElement("slot"));

      this.addEventListener('click', ()=>{
        if(this.getAttribute('clonable') != 'false') this.cloneNode()
    })
    }
    /**
     * @description Animates TextShadowElement object
     * @property {function} animate
     * @member {Object} TextShadowElement
     * @returns {Object<number>} 
     * 
     */
    animate() {
        /**
         * Original y position of the element
         * @const
         * @type {number} 
         * 
         */
        const o_y = parseFloat( this.style.top ) || 0;

        let y;
        const amplitude = 20; // Amplitude of the vertical movement
        const speed = 0.02; // Speed of the vertical movement
        y = o_y + amplitude * Math.sin(speed * Date.now());
        this.style.top = y + 'px'

    }

    addClonableEventListener(event, callback, options){
        console.log('Added'); 
        if(this.#eventListeners[event] == undefined) this.#eventListeners[event] = []
        this.#eventListeners[event].push(callback);
        super.addEventListener(event, callback)
    }
    cloneNode(){
        let clone = super.cloneNode(true);
        for(let event in this.#eventListeners){
            for(let callback of this.#eventListeners[event]){
                clone.addClonableEventListener(event, callback.bind(clone))
            }
        }
        this.parentElement.append(clone);
        this.dispatchEvent(new CustomEvent('clone', {
            detail: {node: clone, content: clone.shadowRoot.querySelector('slot').assignedElements()[0]}
        }))
    }
  
  
    reset() {
      // Reset any necessary properties or states here
    }
  }


customElements.define("text-shadow-element", TextShadowElement);