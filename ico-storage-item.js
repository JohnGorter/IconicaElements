import '/node_modules/@polymer/polymer/polymer.js'
import { Element } from '/node_modules/@polymer/polymer/polymer-element.js'


export class IcoStorageItem extends Element {
    static get properties(){
        return {
            data: { type:Object, value:undefined, observer:'_dataChanged'},
            ref: { type:String, value:"", notify:true},
            url: { type:String, value:"", notify:true},
            lastResponse: { type:Object, value:{}, notify:true }
        }
    }
    connectedCallback() {
        super.connectedCallback();
    }

    _dataChanged(){
        if (this.ref && this.data){
            return firebase.storage().ref(this.ref).put(this.data).then((snapshot) => {
                firebase.storage().ref(this.ref).getDownloadURL().then((url) => {   
                    this.url = url; 
                    this.lastResponse = { outcome: "Success!" } ;
                    this.dispatchEvent (new CustomEvent("fileuploaded", { url:this.url}));
                });
            }).catch((error) =>{
                this.lastResponse = error;
            });
        }
    }
}

customElements.define("ico-storage-item", IcoStorageItem)