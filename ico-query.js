import '/node_modules/@polymer/polymer/polymer.js'
import { Element } from  '/node_modules/@polymer/polymer/polymer-element.js'


export class IcoQuery extends Element {
    static get properties () {
        return {
            source: { type:String, value:'firebase', observer:'_sourceChanged'},
            data:{ type:Array, value:[], notify:true },
            path:{ type:String, value:'',  observer:'_pathChanged'},
        }
    }
    connectedCallback(){
        console.log("querying for data");
        super.connectedCallback(); 
        
    }
    _sourceChanged(){
        console.log("source changed");
        this._getData(); 
    }

    _dataChanged(coll){
        if (coll) {
            console.log("completed querying for data");
            performance.mark("queryend");
            performance.measure("querytotal", "query", "queryend");
            
        }
        if (this.source == "firebase")  
            this.data = coll.docs.map((d) => {
                var obj = d.data();
                obj._id = d.id;
                return obj;
            });
        else 
            this.data = coll;

        this.ref = this.collection;
        if (this.source == "firebase") 
            this.ref.push = this.ref.add;  //* hack for bwards compat */
    }
    _pathChanged(){
        console.log("path changed");
        if (this.path && this.path.length > 1) {
            if (this._subscription) {
                this._subscription(); 
            }
            console.log("start querying for data");
            performance.mark("query");
            this._getData(); 
           
        }
    }

    _getData(){
        if (this.source == "firebase") this._getDataFromFirebase(); 
        else this._getDataFromLocalStorage();
    }
    _getDataFromFirebase(){
        this.collection = firebase.firestore().collection(this.path).limit(10);
        this._subscription = this.collection.onSnapshot(this._dataChanged.bind(this));
    }

    _getDataFromLocalStorage(){
        if (this.path && this.path.length > 1) {
            console.log("getting data from localstorage with path ", this.path);
            this.collection = new Promise((res, rej) => {
                if (localStorage[this.path])
                    res(JSON.parse(localStorage[this.path]));
            }); 
            this.collection.then(this._dataChanged.bind(this));
        }
    }
}

customElements.define('ico-query', IcoQuery);