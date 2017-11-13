import '/node_modules/@polymer/polymer/polymer.js'
import { Element } from  '/node_modules/@polymer/polymer/polymer-element.js'

export class IcoDocument extends Element {
    static get observers () {
        return ['_refChanged(path, docid)', '_dataChanged(data.*)'];
    }
    static get properties () {
        return {
           path:{ type:String, value:''},
           docid: { type:String, value:''},
           data:{ type:Array, value:[], notify:true }
        }
    }
    connectedCallback(){
        super.connectedCallback(); 
        
    }
    _dataChanged(data){
        if (this.data && this.data._id) { this.docid = this.data._id; delete this.data._id; return; } 
        if (!this.path || !this.docid || !this.data || this._docchanged) return;
        firebase.firestore().collection(this.path).doc(this.docid).set(this.data);
    }
    _docChanged(doc) {
        this._docchanged = true;
        this.data = doc.data();
        this._docchanged = false;
    }
    _refChanged(){
        if (!this.path || !this.docid) return;
        if (this.unsubscribe) this.unsubscribe(); 
        var doc = firebase.firestore().collection(this.path).doc(this.docid)
        this.unsubscribe = doc.onSnapshot(this._docChanged.bind(this));
        doc.get().then((d) => { 
            this._docChanged(d); 
        }); 
    }
}

customElements.define('ico-document', IcoDocument);