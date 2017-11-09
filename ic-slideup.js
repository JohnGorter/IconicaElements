import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import { GestureEventListeners } from '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'


const htmlTemplate = `
    <div>
    </div>
`;

export class SlideUpContainer extends GestureEventListeners(PolymerElement){
    static get template() {
        return htmlTemplate;
    } 
}