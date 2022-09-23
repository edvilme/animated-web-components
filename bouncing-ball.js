import AnimationElement from "./animation-element.js";

class BouncingBallElement extends AnimationElement {
    /**
     * @type {Object<String, Array<Function>>}
     */
    #eventListeners = {}
    constructor(inityvelocity=0, styleoptions = {}){
        super();
        this.attachShadow({mode: 'open'})
        this.yvelocity = 0
        this.timeelapsed = 0;
        console.log("Parent element height: ");
        console.log(this.parentElement.offsetHeight )
        // add default ball styling
        this.style.backgroundColor = styleoptions.color || 'blue'
        this.style.borderRadius = '999px'
        this.style.width = '40px'
        /*
        border-radius: 999px;
        height: 200px;
        width: 200px;
        align-items: center;*/
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
        /**
         * Calculate new velocity
         */
        const gravity = 10;
        let x, y;
        x = o_x;
        y = o_y + this.yvelocity;
        this.yvelocity += gravity;
        const angle = 0;
        
        console.log("neew position (x,y): ")
        console.log(x,y);
        console.log("yvelocity: ");
        console.log(this.yvelocity);
        if(y === this.parentElement.offsetHeight) {
            console.log("Bound reached. ");
            console.log("New y velocity: ")
            this.yvelocity *= -1;
            console.log(this.yvelocity);
        }
        // collision detection
        else if(y > this.parentElement.offsetHeight ) {
            const ydelta = y - this.parentElement.offsetHeight;
            let bouncetime = Math.sqrt(this.parentElement.offsetHeight * 2 / gravity);
            console.log("Bounce time:");
            console.log(bouncetime);
            y = this.parentElement.offsetHeight;
            this.yvelocity = gravity * bouncetime;


            console.log("Bound reached. ");
            console.log("New y velocity: ")
            this.yvelocity *= -1;
            console.log(this.yvelocity);
        }
        /*
        do {
            x = o_x + 0;
            y = o_y + this.yvelocity;
            console.log("neew position: ")
            console.log(x,y);
            console.log("yvelocity: ");
            console.log(this.yvelocity);
            if(y == this.parentElement.offsetHeight || y == 0 ) {
                this.yvelocity = -1;
            }
        } while (x > this.parentElement.offsetWidth || y > this.parentElement.offsetHeight || x < 0 || y <= 0);
        */
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
