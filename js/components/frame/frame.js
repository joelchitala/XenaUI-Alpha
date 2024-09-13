import { generateUUID } from "../../shared/utilities.js";
import { Hub } from "../hub/hub.js";

export class Frame {
    constructor() {
        this.data = {
            "id":generateUUID(),
            "body":document.createElement('div'),
            "template":null,
            "hub":null,
        }

        this.subFrames = [];
        this.currentSubFrame = null;
        this.historyStack = [];
        this.forwardStack = [];
    }

    setHub(hub){
        this.data.hub = hub;
    }

    registerSubFrame(subFrame){

        if (this.subFrames.length == 0) {
            this.currentSubFrame = subFrame;
        }else{
            for (let i = 0; i < this.subFrames.length; i++) {
                const sub = this.subFrames[i];
                
                if(sub.data["id"] == subFrame.data["id"]){
                    return false;
                }
            }
        }
        
        subFrame.setFrame(this);
        this.subFrames.push(subFrame);

        return true;
    }

    goToSubFrame(subFrame){

        if(this.currentSubFrame == subFrame){
            return false;
        }

        this.currentSubFrame = subFrame;
        this.render();

        return true;
    }

    popSubFrame(){
        if(this.historyStack.length == 0){
            return;
        }

        const len = this.historyStack.length;

       const history =  this.historyStack[len - 1];

       if(history == null || history == undefined){
            return;
       }

       if(this.getCurrentPage() != null){
        this.forwardStack.push(this.getCurrentPage().generatePath());
       }

       this.goToSubFrame(history["subFrame"]);

      this.historyStack.splice(len - 1, 1);
    }

    pushSubFrame(){
        if(this.forwardStack.length == 0){
            return;
        }

       const forward =  this.forwardStack[this.forwardStack.length -1];

       if(!forward ){
            return;
       }

        const currPage = this.getCurrentPage();

        const res = this.goToSubFrame(forward["subFrame"]);

       if(currPage != null && res){
            this.historyStack.push(currPage.generatePath());
        }

        const len = this.forwardStack.length;

        this.forwardStack.splice(len - 1, 1);
    }

    setTemplate(template = (self,body,subFrame)=>{}){
        this.data.template = template;
    }

    getCurrentPage(){
        if(this.currentSubFrame == null){
            return null;
        }

        const currentPage = this.currentSubFrame.currentPage;

        if(currentPage == null){
            return null;
        }

        return currentPage;
    }

    render(){
        const body = this.data.body;
        const template = this.data.template;
        const curr_subframe = this.currentSubFrame;

        body.innerHTML = "";
        
        if (curr_subframe != null) {
            curr_subframe.renderPage();
        }

        if(template == null){
           if(curr_subframe != null){
            body.appendChild(curr_subframe.data["body"]);
           }
        }else{
            template(this,body,curr_subframe);
        }
    }
}


export const pageNavigator = (gotoPage, data = null) =>{
    const hub = new Hub();

    const currentPage = hub.getCurrentPage();

    if(!currentPage || !gotoPage){
        return;
    }

    if(currentPage == gotoPage){
        return;
    }

    const currPath = currentPage.generatePath();
    const gotoPath = gotoPage.generatePath();

    if(Object.values(currPath).includes(null) || Object.values(gotoPath).includes(null)){
        return;
    }

    if(currPath["frame"] != gotoPath["frame"]){
        console.error(`Only paths with the same frame are permitted ${currPath["frame"]} != ${gotoPath["frame"]} `);
        return;
    }
    
    const frame = currPath["frame"];

    const subFrame = gotoPath["subFrame"];

    if(currPath["subFrame"] != gotoPath["subFrame"]){
        frame.goToSubFrame(subFrame);
    }

    subFrame.goToPageExplicit(gotoPage);

    // if(gotoPage.data["refresh"]){
    //     gotoPage.refresh();
    // }
    
    if(currPath["subFrame"] != gotoPath["subFrame"]){
        frame.historyStack.push(currPath);
    }

    frame.forwardStack = [];
}