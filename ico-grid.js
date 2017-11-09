import '/node_modules/@polymer/polymer/polymer.js'
import { GestureEventListeners } from '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'

var template = `
    <style>
         .gridcontainern { display:flex;flex-flow:wrap;padding:5px;}
         .gridcontainer { position:absolute;display:flex;flex-direction:row;flex-wrap:wrap;}
         .rowcontainer { position:absolute;display:flex;flex-direction:row;flex-wrap:wrap;width:100vw;border:1px solid black;}
         .containerleft {flex:1;display: grid;grid-template-columns: 50% 25% 25%; grid-template-rows: auto; grid-template-areas: "main second third"  "main fourth fifth";}
         .containerright {flex:1;display: grid;grid-template-columns: 25% 25% 50%; grid-template-rows: auto; grid-template-areas: "second third main"  "fourth fifth main";}
         .containermiddle {flex:1;display: grid;grid-template-columns: 25% 50% 25%; grid-template-rows: auto; grid-template-areas: "second main third"  "fourth main fifth";}
        
        .item-row { flex:1;min-width:100vw;min-height:50px;background-color:coral;margin:5px;transition:all 0.2s;}
        .item-row[focus] { z-index:10; outline: 5px solid #71d1a4; background-color:#71d1a4;}

        .item-n { min-width:50px;min-height:50px;background-color:coral;margin:5px;}
        .item-b { grid-area: main; background-color:lime;}
        .item-c { grid-area: second; background-color:coral;}
        .item-d { grid-area: third; background-color:navy;}
        .item-e { grid-area: fourth; background-color:red;}
        .item-f { grid-area: fifth; background-color:yellow;}
        .item   { min-width:50px;min-height:50px;margin:5px;transition:all 0.2s;}
        .item[focus] { z-index:10; outline: 5px solid #71d1a4; background-color:#71d1a4;}

        .zoom { position:absolute;left:0px;top:0px;z-index:10;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;}
    </style>
        <div id="containerflex" class="gridcontainern">
            <template is="dom-repeat" items="{{_getRows(items.*)}}" as="row">
                <div class$="{{_getRandomLayout(row)}}">
                    <template is="dom-repeat" items="{{_getItemsForRow(row, items.*)}}">
                        <div class$="{{_getClassForIndex(index)}}" on-tap="_select" focus$="{{_focus(row, index, selected)}}"><ico-html html="{{_instTemplate(item)}}"></ico-html> </div> </div>
                    </template>
                </div>
            </template>
        </div>
        <div id="container" class="gridcontainer">
                <template is="dom-repeat" items="{{items}}">
                    <div class$="{{_getClassForIndex(index)}}" focus$="{{_focus(0, index, selected)}}" on-tap="_select">  <ico-html html="{{_instTemplate(item)}}"></ico-html> </div></div>
                </template>
        </div>
        <div id="containerrow" class="rowcontainer">
            <template is="dom-repeat" items="{{items}}">
              <div class$="{{_getClassForIndex(index)}}" focus$="{{_focus(0, index, selected)}}" on-tap="_select"> 
                <ico-html html="{{_instTemplate(item)}}"></ico-html>
               </div>
            </template>
        </div>
</div>
    </iron-pages>
`;

export class IcoHTML extends PolymerElement {
    static get properties (){
        return { html: { type:String, observer:'_htmlChanged'}}
    }
    _htmlChanged(){ this.innerHTML = this.html; }
}
customElements.define('ico-html', IcoHTML);

export class IcoGrid extends GestureEventListeners(PolymerElement) {
    static get template(){ return template; }
    static get properties(){ return {
            flex: { type:Boolean, value:false, observer:'_layoutChange' },
            grid: { type:Boolean, value:false, observer:'_layoutChange' },
            row: { type:Boolean, value:false, observer:'_layoutChange' },
            items: { type:Array, value:[]},
            selected: { type:Number, value:0, notify:true},
            zoomselection: { type:Boolean, value:false, notify:true},
            template: { type:String, value:"", observer:'_layoutChange'},
            as: { type:String, value:"item", observer:'_layoutChange'}
    }}

    connectedCallback(){
        super.connectedCallback();
        if (this.children.length > 0)
            this.template = this.children[0].outerHTML;
    }

    _instTemplate(item){
        var template = "(function(){ var " + this.as + " = " + JSON.stringify(item) + ";var template = " + "`" + this.template + "`;return template;})();";
        template = template.replace(/"/g, "\"");
        var result = eval(template); return result;
    }

    addItem(item){
        this.push('items',item);

    }
    _focus(row, sel, selected){  
        return ((row * 5) +  sel) == selected; 
    }

    _select(e){  
        this.selected = this.items.indexOf(e.model.item); 
        if (this.zoomselection){
            if (e.currentTarget.className.indexOf("zoom") < 0)
                e.currentTarget.classList.add("zoom");
            else
                e.currentTarget.classList.remove("zoom");
        }
    }

    _getClassForIndex(index){
        return this.flex ? "item item-" + ("bcdef".charAt(index%5)) : this.row ? "item-row" :"item item-n";
    }
    _getItemsForRow(row, items){
        this.rowitems = [];
        for (var i = row * 5; i < this.items.length && i < ((row * 5) + 5); i++)
            this.rowitems.push(this.items[i]);
        return this.rowitems;
    }
    _getRows(){
        if (this.flex) {
            this.rows = [];
            for (var i=0; i < this.items.length; i++) this.rows.push(i);
            return this.rows;
        }
        return 0;
    }
    _getRandomLayout(row){
        var rnd =  Math.floor(Math.random() * 3);
        return  ["containermiddle", "containerleft", "containerright"][rnd];

    }
    _layoutChange(){
        this.$.container.style.display = this.grid ? "flex":"none";
        this.$.containerflex.style.display = this.flex ? "grid":"none";
        this.$.containerrow.style.display = this.row ? "flex":"none";
        var cacheditems = this.items.slice(0); 
       // this.items = [];
        setTimeout(() => {
            this.items = cacheditems.slice(0);
        }, 10);
    }
}

customElements.define('ico-grid', IcoGrid);