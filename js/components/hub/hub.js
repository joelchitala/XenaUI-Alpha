import { generateUUID } from "../../shared/utilities.js";

export class Hub {
    constructor() {

        if(!Hub.instance){
            Hub.instance = this;
        }

        this.data = {
            "id":generateUUID(),
            "parent":null,
        }

        this.frames = [];
        this.currentFrame = null;


        return Hub.instance;
    }

    setParentElement(parent){
        this.data.parent = parent;
    }

    getCurrentPage(){
        if(this.currentFrame == null){
            return null;
        }

        return this.currentFrame.getCurrentPage();
    }

    registerFrame(frame){
        const f = this.frames.find(x => x.data["id"] == frame.data["id"]);

        if(f){
            return false;
        }

        if(this.frames.length == 0){
            this.currentFrame = frame;
        }

        frame.setHub(this)
        
        this.frames.push(frame);

        return true;
    }

    deRegisterFrame(frame){
        const index = this.frames.indexOf(frame);

        if(index == -1){
            return;
        }

        this.frames.splice(index,1);

        if(this.frames.length == 0){
            this.currentFrame = null;

            return;
        }

        if(index > this.frames.length -1){
            this.currentFrame = this.frames[index-1];
            return;
        }

        if(index < this.frames.length -1){
            this.currentFrame = this.frames[index];
            return;
        }
    }

    goToFrame(frame){
        const res = this.frames.includes(frame);

        console.log(res);
        

        if(!res){
            return false;
        }

        this.currentFrame = frame;

        this.render();
    }

    render(){
        const parent = this.data.parent;

        if(!parent){
            return;
        }
        
        if(this.currentFrame == null){
            return;
        }
        
        parent.innerHTML = "";
        
        this.currentFrame.render();
        
        parent.appendChild(this.currentFrame.data["body"])
    }
}