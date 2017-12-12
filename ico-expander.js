import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import { GestureEventListeners } from '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'

const htmlTemplate = `
    <style>
     #container { min-width:100vw;min-height:600px;}
     #header { transition:all 2s ease-in-out;height:65px;}
     #header.expanded { height:265px; }
     #content { background-color:red;min-height:600px}
    </style>
    <div id="container">
        <div id="header" on-tap="toggle"><slot name="header"></slot></div>
        <div id="content">
                <slot name="content"></slot>
        </div>
    </div>
`;

export class IcoExpander extends GestureEventListeners(PolymerElement){
    static get template() {
        return htmlTemplate;
    } 
    static get properties() {
        return { swipeable: { type:Boolean, value:true}}
    }

    connectedCallback(){
        super.connectedCallback();
        this.addEventListener("pointerdown", (e) => {
            console.log('down', e);
            this.shouldscroll = true;
        });
        this.addEventListener("pointerup", (e) => {
            console.log('up', e);
            this.shouldscroll = false;
        });
        this.addEventListener("pointermove", (e) => {
            if (this.shouldscroll){
                if (e.path[0] == this.$.content)
                e.path[0].style.translate = 'transform'
            }
        });
    }

    toggle(){
        if (this.state=="up"){
            this.$.header.classList.add("expanded")
            this.state="down";
        } else {
            this.$.header.classList.remove("expanded")
            this.state="up";
        }
    }


 }

customElements.define('ico-expander', IcoExpander);