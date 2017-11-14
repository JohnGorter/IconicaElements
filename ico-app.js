import '/node_modules/@polymer/polymer/polymer.js'
import { Element } from  '/node_modules/@polymer/polymer/polymer-element.js'

 const htmlTemplate = `
 `

 export class IcoApp extends Element {
    static get template() { return htmlTemplate; }
    static get properties () {
        return {
            apiKey : { type:String },
            authDomain : { type:String },
            databaseURL : { type:String },
            projectId : { type:String },
            storageBucket : { type:String },
            messagingSenderId : { type:String },
        }
    }
    connectedCallback(){
        super.connectedCallback(); 
        firebase.initializeApp({
            apiKey: this.apiKey,
            authDomain: this.authDomain,
            databaseURL: this.databaseURL,
            projectId: this.projectId,
            storageBucket: this.storageBucket,
            messagingSenderId: this.messagingSenderId
        });
    }
}

customElements.define('ico-app', IcoApp);