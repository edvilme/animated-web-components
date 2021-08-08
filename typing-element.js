import AnimationElement from "./animation-element.js";

function isIncompleteHTMLTag(text){
    return /<\/*$/gmi.test(text) || /(<\w*(?:\s+\w+=\"[^"]+\")*)(?=[^>]+(?:<|$))/gmi.test(text)
}
function isInvisibleChar(text){
    return /\s+$/gmi.test(text)
}

class TypingElement extends AnimationElement{
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
    render(){
        this.shadowRoot.innerHTML = "";
        this.#slot = document.createElement('slot');
        this.#slot.style.display = 'none'
        this.shadowRoot.append(this.#slot);
        this.#span = document.createElement('span');
        this.shadowRoot.append(this.#span);
    }
    animate(){
        if(this.typedLetters > this.text.length) this.typedLetters = 0; 
        this.disableAnimation()
        let typedText;
        do{
            typedText = this.text.substr(0, this.typedLetters)
            this.typedLetters++;
        }while((isInvisibleChar(typedText) || isIncompleteHTMLTag(typedText)) && this.typedLetters <= this.text.length)
        this.#span.innerHTML = typedText
        this.enableAnimation()
    }
    reset(){
        this.typedLetters = parseInt(this.getAttribute('typed-letters')) || 0;
        if(this.getAttribute('typed-letters') == 'all') this.typedLetters = this.text.length
    }
}
customElements.define('typing-element', TypingElement)