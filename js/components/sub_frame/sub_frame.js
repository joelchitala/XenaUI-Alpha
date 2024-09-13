import { compareDict, generateUUID } from "../../shared/utilities.js";

export class SubFrame {
    constructor() {
        this.data = {
            "id":generateUUID(),
            "frame":null,
            "template":null,
            "body":document.createElement('div')
        }
        this.pages = [];
        this.currentPage = null;
    }

    registerPage(page){
        for (let i = 0; i < this.pages.length; i++) {
            const p = this.pages[i];
            const res = compareDict(p.getData()["name"],page.getData()["name"]);

            if(res){
                return false;
            }
        }
        
        if(this.pages.length == 0){
            this.currentPage = page;
        };

        page.setSubFrame(this);
        this.pages.push(page);

        return true;
    }

    deRegisterPage(query = {}){
        for (let i = 0; i < this.pages.length; i++) {
            const page = this.pages[i];
            const res = compareDict(page.getData(),query);

            if(res){
                this.pages.splice(i,1);

                if(this.currentPage == page){
                    if(this.pages.length > 0){
                        this.goToPage(this.pages[i-1]);
                    }else{
                        this.currentPage = null;
                    }
                }

                page.setSubFrame(null);
                break;
            }
        }
    }

    setFrame(frame){
        this.data.frame = frame;
    }

    goToPageExplicit(page){
        if(this.currentPage == page){
            return;
        }

        for (let i = 0; i < this.pages.length; i++) {
            const x = this.pages[i];
            const res = compareDict(x.getData()["id"],page.getData()["id"]);

            if(res){
                this.currentPage = page;
                this.renderPage();
                break;
            }
        }
    }

    renderPage(){
        this.data.body.innerHTML = "";
        
        if(this.data.template == null){
            this.data.body.appendChild(this.currentPage.body);
        }else{
            this.data.template(this,this.data.body,this.currentPage);
        }
    }

    refresh(){
        let curr = this.currentPage;
        if (curr == undefined || curr == null) {
            return;
        }

        curr.refresh();
    }

    setTemplate(template = (self,body,page)=>{}){
        this.data.template = template;
    }
}