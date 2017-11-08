import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import { GestureEventListeners } from '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import './ico-grid.js'

const template = `
    <style>
    </style>
    <div class="container">
        <ico-grid selectable flexsizes items="{{thumbs}}" selected="{{selectedthumb}}"><ico-grid>
    </div>
`;
export class IconicaGallery extends GestureEventListeners(PolymerElement) {
    static get template(){ return template; }
    static get properties() { return { 
        thumbs : { type:Array, value:['v','r','t','t','h'], notify:true},
        selectedthumb : { type:Number, value:0, notify:true},
    }}
}

customElements.define('ico-gallery', IconicaGallery);