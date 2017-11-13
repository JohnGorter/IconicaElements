import '/node_modules/@polymer/polymer/polymer.js'
import { Element } from  '/node_modules/@polymer/polymer/polymer-element.js'


export class IcoQuery extends Element {
    static get properties () {
        return {
           path:{ type:String, value:'',  observer:'_pathChanged'},
           data:{ type:Array, value:[], notify:true }
        }
    }
    connectedCallback(){
        super.connectedCallback(); 
        
    }
    _dataChanged(coll){
        this.data = coll.docs.map((d) => {
            var obj = d.data();
            obj._id = d.id;
            return obj;
        });
        this.ref = this.collection;
        this.ref.push = this.ref.add;  //* hack for bwards compat */
    }
    _pathChanged(){
        if (this.path && this.path.length > 1) {
            if (this._subscription) {
                this._subscription(); 
            }
            this.collection = firebase.firestore().collection(this.path);
            this._subscription = this.collection.onSnapshot(this._dataChanged.bind(this));
        }
    }
}

customElements.define('ico-query', IcoQuery);