import '/node_modules/@polymer/polymer/polymer.js'
import { GestureEventListeners } from '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import '/node_modules/@polymer/paper-button/paper-button.js'
import '/node_modules/@polymer/paper-progress/paper-progress.js'
import './polyfills/MediaStreamRecorder.js'

var template = `
<style>
    paper-progress { --paper-progress-height: 40px; --paper-progress-secondary-color:var(--paper-green-100);--paper-progress-active-color:var(--paper-green-500);z-index:11;}
    #container { position:relative;display:flex;justify-content:center;align-items:center;background-color:black;height:100%;width:100%;}
    video { position:absolute;border:0px solid red;left:0px;top:0px;z-index:0;height:100%;width:100%;}
    #counter { z-Index:10;font-size:128px;color:white;align-content:center;}
    #progressbar { top:0px;width:100%;height:20px;}
    </style>
    <paper-progress id="progressbar" style="visibility:hidden" value="99" max="{{recordingtime}}" min="0" secondary-progress="{{recordingtime}}"></paper-progress>
    <div id="container" on-tap="init">
        <span id="counter">{{currentcounter}}</span>
        <video id="preview" autoplay playsinline muted></video>
        <video id="video" hidden controls></video>
    </div>
    <canvas id="canvas" hidden></canvas>
`;

export class IconicaVideoRecorder extends GestureEventListeners(PolymerElement) {
    static get template()   { return template; }
    static get properties() {
        return {
            video: { type:Object, notify:true },
            videoblob: { type:String, value:"", notify:true },
            counter: { type:Number, value:3},
            duration: { type:String, value:''},
            recordingtime: { type:Number, value:7, notify:true},
            thumbs: { type:Array, value:[], notify:true}
        };
    }

    constructor(){
        super(); 
    }
    connectedCallback(){
        super.connectedCallback(); 
        this.currentcounter = this.counter;
    }

    init(autostart){
        this.$.counter.hidden = true;
        this.currentcounter = this.counter;
        var hdConstraints = { audio:true,  video: true };
        this.$.video.src = '';
        this.$.video.hidden = true;
        navigator.mediaDevices.getUserMedia(hdConstraints).then((stream)=>{
            this.stream = stream;
            this.$.preview.srcObject = stream;
            this.$.preview.hidden = false;
            this.$.preview.play(); 
            if (autostart) this.start();
        });
    }

    stop(){
        this.playing = false;
        this.stream.stop();
        this.$.counter.hidden = true;
        this.$.video.src = '';
        this.$.video.hidden = true;
        this.$.progressbar.style.visibility = 'hidden';
        this.dispatchEvent(new CustomEvent('stop', {}));
    }

    save(){
        this.playing = false;
        this.stream.stop();
        this.dispatchEvent(new CustomEvent('save', { detail:{data:this.video, thumb:this.thumb}}));
    }

    start(){
        this.thumbs = [];
        this.$.counter.hidden = false;
        this.$.video.hidden = true;
        this.currentcounter = this.counter;
        var interval = setInterval(()=>{
            this.currentcounter = this.currentcounter - 1;
            if (this.currentcounter == 0) {
                this.$.counter.hidden = true;
                this.currentcounter = this.counter;
                this.startRecording();
                clearInterval(interval);
            } 
        }, 1000);
    }

    startRecording(){
        var timer = this.recordingtime;
        this.starttime = Date.now();
        this.duration = "00:00";
        this.$.progressbar.style.visibility = 'visible';
        this.playing = true;
        this.completed = false;
        var mediaRecorder = new MediaStreamRecorder(this.stream);
        this.$.canvas.width = this.$.preview.videoWidth / 3;
        this.$.canvas.height = this.$.preview.videoHeight / 3;
        mediaRecorder.stream = this.stream;
        this.interval = setInterval(()=>{
            var seconds = Date.now() - this.starttime;
            this.duration = "00:0" + Math.round(seconds / 1000);
            if (this.thumbs.length < 3){
                this.$.canvas.getContext("2d").drawImage(this.$.preview, 0, 0, this.$.preview.videoWidth / 3, this.$.preview.videoHeight / 3);
                this.thumbs.push(this.$.canvas.toDataURL("image/png"));
            }
            this.$.progressbar.value = timer--;
        }, 1000);

        mediaRecorder.ondataavailable = (blob) => {
            if (!this.completed){
                clearInterval(this.interval);
                this.video = window.URL.createObjectURL(blob);
                this.$.video.src = this.video;
                //this.$.video.controls = true;
                this.$.video.hidden = false;
                this.$.preview.hidden = true;
                mediaRecorder.stop(); 
                this.completed = true;
                this.dispatchEvent(new CustomEvent("recording-complete"));
                this.playing = false;
                this.duration = "";

                fetch(this.video)
                .then(res => res.blob())
                .then(blob => this.videoblob = blob);
            }
        }
        mediaRecorder.start((this.recordingtime + 1) * 1000);
    }
}

customElements.define('ico-recorder', IconicaVideoRecorder);