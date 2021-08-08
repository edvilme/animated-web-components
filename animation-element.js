export default class AnimationElement extends HTMLElement {
    /** @type {Array<AnimationElement>} Lists all the instances of this class */
    static #instances = [];
    /** @type {Object<Number, Number>} Object containing all intervals (this helps keep everything in cycle and increases performance) */
    static #intervals = {};
    /** @type {Number} Number of seconds for each animation */
    get animationSpeed(){
        return parseFloat( this.getAttribute('animation-duration') )*1000 || 500
    }
    /** @type {Boolean} Determines whether the animation should be ran */
    isAnimationEnabled;
    constructor(){
        super();
        AnimationElement.#instances.push(this)
        this.isAnimationEnabled = !!this.getAttribute('animation-enabled');
        if(this.isAnimationEnabled) this.enableAnimation()
    }
    enableAnimation(){
        this.isAnimationEnabled = true;
        AnimationElement.#intervals[ this.animationSpeed ] ??= setInterval(() => {
            AnimationElement.#instances
                .filter(node=>node.animationSpeed == this.animationSpeed && node.isAnimationEnabled)
                .forEach(node=>{
                    window.requestAnimationFrame(node.animate.bind(node))
                })
        }, this.animationSpeed)
        
    }
    disableAnimation(){
        this.isAnimationEnabled = false;
    }
}