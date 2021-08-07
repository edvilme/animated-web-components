const __currentDirectory = import.meta.url.substring(0, import.meta.url.lastIndexOf('/'));

class FloatingRandomThing extends HTMLElement {
    // Get observed properties
    static get observedAttributes(){
        return ['animation-duration', 'animation-range', 'auto']
    }
    /**
     * All of the event listeners are privately stored here
     * @type {Object<String, Array<Function>>}
     */
    #eventListeners = {};

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this.cloneCount = 0;
    }

    connectedCallback(){
        this.render();
    }

    /**
     * Renders the element and style
     * @returns {void}
     */
    render(){
        this.shadowRoot.innerHTML = "";
        const style = document.createElement('link');
        style.rel = "stylesheet";
        style.href = __currentDirectory+"/floating-random-thing.css";
        this.shadowRoot.append(style)
        let children = document.createElement('slot');
        this.content = children.firstChild
        this.shadowRoot.append(children);
        // Conditions
        // If auto enabled, enable interval
        if(this.getAttribute('auto') != null && this.getAttribute('auto') != 'null') this.enableInterval();
        if(this.getAttribute('duplicates') == 'true') {
            super.addEventListener('click', this.cloneNode.bind(this))
        }
    }

    /**
     * Updates position by a fixed distance in a random direction
     * @returns {{x: Number, y: Number}}
     */
    updatePosition(){
        const o_x = parseFloat(this.style.left) || 0;
        const o_y = parseFloat(this.style.top) || 0;
        const randomAngle = Math.random()*2*Math.PI;
        let x = o_x + this.getAttribute('animation-range') * Math.sin(randomAngle);
        let y = o_y + this.getAttribute('animation-range') * Math.cos(randomAngle);
        // Detects out of bounds (includes margin)
        if(x < 0 || x > this.parentElement.clientWidth || y < 0 || y > this.parentElement.clientHeight) return this.updatePosition();
        this.style.left = x + 'px';
        this.style.top = y + 'px';
        // Dispatch event
        this.dispatchEvent( new CustomEvent('update-position', {detail: {angle: randomAngle, x, y}}) )
        return {x, y}
    }

    /**
     * Enables interval
     */
    enableInterval(){
        this.interval = setInterval(this.updatePosition.bind(this), this.getAttribute('animation-duration'))
    }

    /**
     * Disables interval
     */
    disableInterval(){
        clearInterval(this.interval)
    }

    /**
     * @see {HTMLElement.addEventListener}
     * @override
     */
    addEventListener(event, fn){
        if(this.#eventListeners[event]){
            this.#eventListeners[event].push(fn);
        } else {
            this.#eventListeners[event] = [fn]
        }
        super.addEventListener(event, fn);
    }

    /**
     * @see {Node.cloneNode}
     * @override
     */
    cloneNode(){
        // Clone node
        let cloned = super.cloneNode(true);
        // Duplicate event listeners
        for(let event in this.#eventListeners){
            for(let fn of this.#eventListeners[event]){
                cloned.addEventListener(event, fn);
            }
        }
        // Duplicate attributes
        for(let attr of FloatingRandomThing.observedAttributes){
            cloned.setAttribute(attr, this.getAttribute(attr))
        }
        // Append to parent
        this.parentElement.append(cloned)
        this.dispatchEvent( new CustomEvent('clone', {detail: cloned}) )
    }

}
customElements.define('floating-random-thing', FloatingRandomThing);
