import { generateUUID } from "../../shared/utilities.js";

export class Page {
    constructor(name, refresh = false) {
        this.data = {
            "id":generateUUID(),
            "name":name,
            "subFrame":null,
            "body": document.createElement('div'),
            "refresh": refresh,
        };
        
        this.template = null;
    }
    
    getData(){
        return this.data;
    }

    getBody(){
        return this.data.body;
    }

    setSubFrame(subFrame){
        this.data.subFrame = subFrame;
    }

    setTemplate(template = (self,body)=>{}){
        this.template = template;
        this.refresh();
    }

    refresh(){
        this.data.body.innerHTML = "";
        this.template(this,this.data.body);
    }

    generatePath(){
        const subFrame = this.data.subFrame;
        const frame = subFrame == null ? null : subFrame.data["frame"];

        return {    
            "frame": frame,
            "subFrame": subFrame,
            "page": this,
        }
    }
}