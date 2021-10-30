import AnimationElement from "./animation-element.js";

/**
 * Checks for HTML tags
 * @property {function} isIncompleteHTMLTag
 * @param {string} text
 * @returns {boolean} True for incomplete HTML tag
 *
 */
function isIncompleteHTMLTag(text){
    return /<\/*$/gmi.test(text) || /(<\w*(?:\s+\w+=\"[^"]+\")*)(?=[^>]+(?:<|$))/gmi.test(text)
}


/**
 * Checks character type
 * @param {string} text 
 * @returns {boolean} True for invisible chararacter, false for others
 */
function isInvisibleChar(text){
    return /\s+$/gmi.test(text)
}

/**
 * Class to create a Typing Element
 */

class TypingElement extends AnimationElement{
    
    /**
     * @type {string}
     */
    typedLetters;
    #slot;
    #span;
    get text(){
        return this.#slot.assignedElements()[0].innerHTML;
    }
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this.reset()
    }
    connectedCallback(){
        this.render();
    }

    /**
     * Renders animated text to screen
     * @property {function} render
     * @member {Object} TypingElement 
     * @returns {void} Prints out TypingElement object
     * 
     */
    render(){
        this.shadowRoot.innerHTML = "";
        this.#slot = document.createElement('slot');
        this.#slot.style.display = 'none'
        this.shadowRoot.append(this.#slot);
        this.#span = document.createElement('span');
        this.shadowRoot.append(this.#span);
    }

    /**
     * Animates TypingElement object
     * @property {function} animate
     * @member {Object} TypingElement 
     * @returns {void} Print typwriter text 
     */
    animate(){
        if(this.typedLetters > this.text.length) this.typedLetters = 0; 
        this.disableAnimation()
        
        /**
         * @type {string}
         */
        let typedText;
        do{
            typedText = this.text.substr(0, this.typedLetters)
            this.typedLetters++;
        }while((isInvisibleChar(typedText) || isIncompleteHTMLTag(typedText)) && this.typedLetters <= this.text.length)
        this.#span.innerHTML = typedText
        this.enableAnimation()
    }

    /** 
     * Resets TypingElement object
     * @property {function} reset
     * @member {Object}
     */
    reset(){
        this.typedLetters = parseInt(this.getAttribute('typed-letters')) || 0;
        if(this.getAttribute('typed-letters') == 'all') this.typedLetters = this.text.length
    }
}
customElements.define('typing-element', TypingElement)
