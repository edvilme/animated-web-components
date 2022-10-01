import AnimationElement from "./animation-element.js";

class BouncingBallElement extends AnimationElement {
    /**
     * @type {Object<String, Array<Function>>}
     */
    #eventListeners = {}
    constructor(){
        super();
        this.attachShadow({mode: 'open'})
        this.yvelocity = 0
        this.timeelapsed = 0;
        console.log("Parent element height: ");
        console.log(this.parentElement.offsetHeight )
        // add ball styling from HTML
        this.backgroundColor = this.getAttribute('color') || null;
        this.radius = this.getAttribute('radius') || null;
        
    }
    get velocity() {
        return this.yvelocity;
    }
    connectedCallback(){
        this.render()
    }

    /**
     * Gets a random point at a given distance. 
     * Done using a parametric circle function given an angle.
     * @property {function} render
     * @member {Object} FloatingRandomElement
     * @returns {void} Prints out FloatingRandomElement object
     * 
     */
    render(){
        this.shadowRoot.innerHTML = ""
        const style = document.createElement('style');
        style.innerHTML = `
            :host{
                position: absolute;
                top: 0px;
                left: 0px;
                transition: ${this.animationSpeed/1000}s linear;
                background-color: ${this.backgroundColor || 'blue'};
                border-radius: 999px;
                width: ${(this.radius * 2) || 40 }px;
                height: ${(this.radius * 2) || 40 }px;
            }
        `;
        this.shadowRoot.append(style);
        this.shadowRoot.append(document.createElement('slot'));

        this.addEventListener('click', ()=>{
            if(this.getAttribute('clonable') != 'false') this.cloneNode()
        })

    }

    /**
     * @description Animates FloatingRandomElement object
     * @property {function} animate
     * @member {Object} FloatingRandomElement
     * @returns {Object<number>} Angle, X and Y
     * 
     */
    animate(){
        // console.log("Hi")
        /**
         * Original x position of the element
         * @const
         * @type {number} 
         * 
         */
        const o_x = parseFloat( this.style.left ) || 0;
        /**
         * Original y position of the element
         * @const
         * @type {number} 
         * 
         */
        const o_y = parseFloat( this.style.top ) || 0;
        
        const gravity = 10;
        let x, y;
        x = o_x;
        this.yvelocity += gravity;
        y = o_y + this.yvelocity;
        const angle = 0;
        if(y === this.parentElement.offsetHeight) {
            this.yvelocity *= -1;
        }
        // collision detection
        else if(y > this.parentElement.offsetHeight ) {
            const ydelta = y - this.parentElement.offsetHeight;
            // calculate time when ball bounces at parentElement offset height.
            let bouncetime = Math.sqrt(this.parentElement.offsetHeight * 2 / gravity);
            // set real y to offset height
            y = this.parentElement.offsetHeight;
            // set velocity to what it would be at the offsetheight, then make it go the reverse direction.
            this.yvelocity = gravity * bouncetime;
            this.yvelocity *= -1;
        }
        this.style.left = x + 'px';
        this.style.top = y + 'px';
        return {angle, x, y};
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
    reset(){

    }
}
customElements.define('bouncing-ball', BouncingBallElement)
