import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import { GestureEventListeners} from '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import '/node_modules/@polymer/paper-progress/paper-progress.js'

const template = `
    <style>
        #content { z-index:10;touch-action:pan-right;background-color:black;width:100vw;}
        #toolbarcontainer { z-index:30;}
        #progressballs { min-height:20px;background-color:black;display:flex;justify-items:center;justify-content:center;align-items:center;}
        .ball { width:8px;height:8px;margin:2px;border-radius:50%;background-color:silver;transition:all 0.3s ease-in-out}
        .ball[selected] { width:11px;height:11px;background-color:white;}
        #progressballs[hidden] { display:none}
        #progressbar[hidden] { display:none}
        #headercontainer { width:100vw;}
        #toolbarcontainer { width:100vw;}
        #progresscontainer { width:100vw;}
        paper-progress {width:100vw;--paper-progress-height:50px;}
        paper-progress.large {width:100vw;--paper-progress-height:100px;}
        paper-progress.small {width:100vw;--paper-progress-height:10px;}
        #headercontainer { @apply(--wizard-header-mixin);}
        #headertitle { @apply(--wizard-headertitlw-mixin);}
        #headersubtitle { @apply(--wizard-headersubtitle-mixin);}
    </style>
    <div id="container">
        <template is="dom-if" if="{{title}}">
            <div id="headercontainer"> 
                <div id="headertitle">{{title}}</div>
                <div id="headersubtitle">{{subtitle}}</div>
            </div>
        </template>
        <div id="content" hidden><slot></slot></div>
        <div id="toolbarcontainer">
            <slot id="toolbar" name="toolbar"></slot>
        </div>
        <div id="progresscontainer">
            <div id="progresscustom"><slot name="progress"></slot></div>
            <div id="progresstext" hidden$="{{!progresstext}}">{{_getProgress(step, totalsteps)}}</div>
            <div id="progressballs" hidden$="{{!progressballs}}"></div> 
            <paper-progress hidden$="{{!progressbar}}" class$="{{_changePBClass(progressbar, progressbarStyle)}}"id="progressbar" min="0" max="100" value="{{_getValue(step)}}" secondary-progress="100"></paper-progress>
        </div>
    </div>
`;

export class IcoWizard extends GestureEventListeners(PolymerElement) {
    static get properties() {
        return { 
            step: { type:Number, value:-1, notify:true, reflectToAttribute:true},
            progressballs: { type:Boolean, value:false},
            showfinish: { type:Boolean, value:false},
            carrousel: { type:Boolean, value:false},
            progresstext: { type:Boolean, value:false},
            progressbar: { type:Boolean, value:false},
            swipeable: { type:Boolean, value:false},
            progressbarStyle: { type:String, value:"normal", observer:'_changePBClass'},
        };
    }
    static get template() {
        return template;
    }

    debounce(f, t){
        if (!this.inprogress){
            this.inprogress = true;
            f();
            setTimeout(() => { this.inprogress = false;}, t); 
        }
    }

    connectedCallback(){
        super.connectedCallback();

        if (this.swipeable){
            // listen for swipes
            this.addEventListener("pointermove", (e) => {
                if (e.movementX > 20) this.debounce(() => { this.previousPage()}, 500);
                if (e.movementX < -20) this.debounce(() => { this.nextPage()}, 500);
            });
          
        }
        var tb = this.$.toolbar.assignedNodes()[0];
        if (tb) {
            this.nextbutton = tb.querySelector("*[nextpage]");
            if(this.nextbutton){
                this.nextbutton.addEventListener("click", () => this.nextPage());
            }
            this.previousbutton = tb.querySelector("*[previouspage]");
            if(this.previousbutton){
                this.previousbutton.addEventListener("click", () => this.previousPage());
            }
        }

        this.pages = Array();
        for(let i = 0; i < this.children.length; i++){
            if (this.children[i].assignedSlot.name == ""){
                this.children[i].classList.add("page");
                this.children[i].hidden = true;
                this.pages.push(this.children[i]);
            }
        }

        this.$.progressballs.innerHTML = "";
        for (let j = 0; j < this.pages.length; j++)
            this.$.progressballs.innerHTML += `<div class='ball'></div>`;
        this.totalsteps = this.pages.length;
        this.$.content.hidden = false;
        this.step = 0;
        if (this.nextbutton)        
            this.previousTitle = this.nextbutton.innerText;
        if (this.previousbutton && !this.carrousel)    
            this.previousbutton.hidden = true;
        this.selectPage('next');
    }

    _changePBClass(){
        return this.progressbarStyle == "normal" ? "": this.progressbarStyle == "large"  ? "large" : "small";
    }

    _getProgress(step, totalsteps){
        return  `Page ${step+1} of ${totalsteps}`;
    }
    _getValue(step){
        return (step * 100) / (this.totalsteps-1);
    }
    previousPage(){
        this.step--;
        if (!this.carrousel) {
            if (this.step < 1) this.step = 0;
            this.nextbutton.hidden = (this.step == (this.pages.length-1));
            this.nextbutton.innerText = this.previousTitle;
            this.previousbutton.hidden = (this.step == 0);
        } else {
            if (this.step < 0) this.step = this.pages.length-1;
        }
        this.selectPage('previous');
    }

    nextPage(){
        if (this.step == (this.pages.length-1)) this.dispatchEvent(new CustomEvent("complete"));
        this.step++; 
        if (!this.carrousel) {
            if (this.step >= this.pages.length) this.step = this.pages.length-1;
            this.nextbutton.hidden = (this.step == (this.pages.length-1) && !this.showfinish);
            if (this.showfinish && this.step == (this.pages.length-1)) {
                this.nextbutton.innerText = this.step == (this.pages.length-1) ? 'Finish' : this.previousTitle;
            } else {
                this.nextbutton.innerText = this.previousTitle;
            }
            this.previousbutton.hidden = (this.step == 0);
           
        } else {
            this.step = this.step % this.pages.length;
        }
        this.selectPage('next');
    }

    selectPage(command){
        for(var i = 0; i < this.pages.length; i++){  
            if (!this.pages[i].hidden) {
                this.pages[i].dispatchEvent(new CustomEvent("close", { detail:command}));
                this.pages[i].hidden = true;
            }
        }
        if (this.step >= 0 && this.step < this.pages.length) {
            var selectedPage =  this.querySelector("*[step" + this.step + "]");
            this.title = selectedPage.getAttribute("title") || "";
            this.subtitle = selectedPage.getAttribute("subtitle") || "";
            selectedPage.hidden = false;
            selectedPage.dispatchEvent(new CustomEvent("open", { detail:command}));
            var balls = this.$.progressballs.querySelectorAll(".ball");
            balls.forEach((element) => {
                element.removeAttribute("selected");
            }, this);
            balls[this.step].setAttribute("selected", true);    
        }
    }
}

customElements.define('ico-wizard', IcoWizard);