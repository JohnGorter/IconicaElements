import '/node_modules/@polymer/polymer/polymer.js'
import { GestureEventListeners } from '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import '/node_modules/@polymer/paper-button/paper-button.js'
import '/node_modules/@polymer/iron-pages/iron-pages.js'
import { IconicaVideoRecorder } from './iconica-videorecorder.js'
import { IconicaVideoRecClassic } from './iconica-videorec.js'
import { IconicaVideoPlayer } from './iconica-videoplayer.js'

var template = `
    <style>
        .container { justify-content:flex-start;border:0px solid black;display:flex;flex-flow;row;flex-wrap:wrap;background-color:white;align-content:flex-start;}
        .recording { display:flex; flex:1;min-width:30%;max-width:30%;border:1px solid gray;margin-bottom:25px;margin:2px;}
        .thumb {background-color:white;display:flex;align-items:center;justify-content:center;}
        .info {width: 100%;height:50px;}
    </style>
    <iron-pages id="pages" selected="0">
        <div class="container">
            <template is="dom-repeat" items="[[videos]]">
            <div class="recording" on-tap="selectVideo"> <div class="thumb" style$="width: 100%;padding-top: 56.25%;background-image:url({{item.thumb}});background-size:100% 100%"></div></div>
            </template>
            <div class="recording"><div class="thumb"><paper-button on-click="plus">Record a new video</paper-button></div></div>
        </div>
        <iconica-videorec on-cancel="stop" id="recorder" on-save="add" on-video-changed="logchange"></iconica-videorec>
        <iconica-videoplayer video="{{selectedVideo.video}}"  thumb="{{selectedVideo.thumb}}" on-stop="stop"></iconica-videoplayer>
    </iron-pages>
`;

export class IconicaGrid extends GestureEventListeners(PolymerElement) {
    static get template(){ return template; }
    static get properties(){ return {
        videos: { type:Array, value:[]},
    }}

    add(event){
        this.push('videos', {thumb:event.detail.thumb, video:event.detail.data});
        this.$.pages.selected = 0;
    }
    stop(){
        this.$.pages.selected = 0;
    }
    logchange(){
        console.log('video data changed');
    }

    plus(){
        this.$.pages.selected = 1;
        this.$.recorder.init();
    }
    selectVideo(){
        this.$.pages.selected = 2;
        this.set("selectedVideo", event.model.item);
    }
}

customElements.define('iconica-grid', IconicaGrid);