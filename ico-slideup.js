import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import { GestureEventListeners } from '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'


const htmlTemplate = `
    <style>
    :host { background-color:pink;}
    #container { position:relative;height:100%;min-width:200px;overflow:hidden;}
    #slideupcontainer { width:100%;height:100%;margin:0px;position:absolute;z-index:10;transition:top 0.45s ease-in-out;background-color:white;}
    #slideupcontainer.up { top:0px;}
    #slideupcontainer.down { }
    #header { position:relative;@apply --header-mixin;transition:all 0.45s ease-in-out;}
    #header.up {position:relative; @apply --header-tall-mixin; transition:all 0.45s ease-in-out;}
    #headerbg{ position:absolute;transition:all 0.45s;@apply --headerbg-mixin;background-size:100% 452px;height:100%;width:100%;opacity:0}
    #headerbg.up{ position:absolute;apply --headerbg-tall-mixin;background-size:100% 452px;height:100%;width:100%;opacity:1;z-index:-1;}
    </style>
    <div id="container">
        <div id="maincontainer"><slot></slot></div>
        <div id="slideupcontainer">
            <div id="header" on-tap="toggle">
                <div id="headerbg">
                </div>
                <slot name="slideupheader"></slot>
            </div>
            <div><slot name="slideup"></slot></div>
        </div>
    </div>
`;

export class IcoSlideUpContainer extends GestureEventListeners(PolymerElement){
    static get template() {
        return htmlTemplate;
    } 
    static get properties() {
        return { swipeable: { type:Boolean, value:true}}
    }

    connectedCallback(){
        super.connectedCallback();
        if (this.swipeable){
            this.addEventListener("pointermove", (e) => {
                if (e.movementY > 2) this.debounce(this.swipeDown, 500);
                if (e.movementY < -2) this.debounce(this.swipeUp, 500);
            });
           
        }

        if (this.children.length > 0){
           var toggle = this.querySelector("button[toggle]");
           if (toggle) toggle.addEventListener("click", () => {this.toggle()});
        }
        this.state = "down";
        this.$.slideupcontainer.style.top = (this.$.container.clientHeight - 44) + 'px';

    }

    correctSwipe(){
       // console.log("toggle");
        this.toggle();
    }

    debounce(f, t){
        if (!this.inprogress){
            this.inprogress = true;
         //   console.log('inprogress true;')
            
            f.bind(this)();
            setTimeout(() => { 
            //    console.log('inprogress false;')
                this.inprogress = false;
            }, t); 
        }
    }

    swipeUp() {
        this.$.slideupcontainer.classList.remove("down")
        this.$.slideupcontainer.classList.add("up");
        this.$.header.classList.add("up");
        this.$.headerbg.classList.add("up");
        this.$.slideupcontainer.style.top = '0px';
        
    }

    toggle(){
      //  console.log('toggling');
        if (this.state == "up"){
            this.$.slideupcontainer.style.top = (this.$.container.clientHeight - 44) + 'px';
            this.$.header.classList.remove("up");
            this.$.headerbg.classList.remove("up");
            this.state = "down";
        } else {
            this.$.slideupcontainer.style.top = '0px';
            this.$.header.classList.add("up");
            this.$.headerbg.classList.add("up");
            this.state = "up";
        }

    }

    swipeDown() {
        this.$.slideupcontainer.classList.remove("up")
        this.$.slideupcontainer.classList.add("down");
        this.$.header.classList.remove("up");
        this.$.headerbg.classList.remove("up");
        this.$.slideupcontainer.style.top = (this.$.container.clientHeight - 44) + 'px';
        
    }
}

customElements.define('ico-slideup', IcoSlideUpContainer);