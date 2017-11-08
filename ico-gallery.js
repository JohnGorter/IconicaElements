import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import { GestureEventListeners } from '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'

const template = `
    <style>
        video { width:100vw;}
        .container {width:100vw;position:relative; display: grid;height:47vh; margin-bottom:90px; grid-template-columns: 66% 33%; grid-template-rows: auto; grid-template-areas: "main second"  "main third";
        }
        .item-b { grid-area: main; padding:2px; }
        .item-c { grid-area: second; padding:2px; }
        .item-d { grid-area: third; }
        .item   { padding:2px; }
        .item[focus] { z-index:10; outline: 5px solid #71d1a4; bordser: thick solid green;background-color:#71d1a4;}
        img { width:100%;height:100%;}
        canvas { width:100%;height:100%;}
    </style>
    <div class="container">
        <div class="item item-b" focus$="{{_focus(1, selected)}}" on-tap="_select"><img id="canvas1"></img></div>
        <div class="item item-c" focus$="{{_focus(2, selected)}}" on-tap="_select"><img id="canvas2"></img></div>
        <div class="item item-d" focus$="{{_focus(3, selected)}}" on-tap="_select"><img id="canvas3"></img></div>
    </div>
`;
export class IconicaGallery extends GestureEventListeners(PolymerElement) {
    static get template(){ return template; }
    static get properties() { return { 
        thumbs : { type:Array, value:[], notify:true},
        selectedthumb : { type:Object, value:{}, notify:true},
    }}

    selectPhoto() {
        // draw the video on the canvas and take random frames..
        this.$.canvas1.src = this.thumbs[0];
        this.$.canvas2.src = this.thumbs[1];
        this.$.canvas3.src = this.thumbs[2]; 
    }

    _select(e){  
        this.selected = e.target == this.$.canvas1 ? 1 : e.target == this.$.canvas2 ? 2 : 3; 
        this.selectedthumb = e.target.src;  
    }
    _focus(sel, selected){  return sel == selected; }
    _isEmpty(obj){  return obj == undefined || Object.keys(obj).length === 0 && obj.constructor === Object; }

    constructor(){
        super();
        this.selected = 1;
        window.addEventListener("keydown", (e) => {
            if (e.key == "ArrowDown")  this.selectNext('down');
            if (e.key == "ArrowLeft")  this.selectNext('left');
            if (e.key == "ArrowRight") this.selectNext('right');
            if (e.key == "ArrowUp")    this.selectNext('up');
        });
        setTimeout(() => {  this.selectPhoto(); }, 1000);
    }

    selectNext(dir){
        if (dir == "right" && this.selected == 1) this.selected = this.previous || 2;
        if (dir == "left" && (this.selected == 2 || this.selected == 3)) { this.previous = this.selected; this.selected = 1; }
        if (dir == "up" && this.selected == 3) this.selected = 2;
        if (dir == "down" && this.selected == 2) this.selected = 3;
    }
}

customElements.define('ico-gallery', IconicaGallery);