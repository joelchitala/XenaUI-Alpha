import { Frame, pageNavigator } from "./components/frame/frame.js";
import { SubFrame } from "./components/sub_frame/sub_frame.js";
import { Page } from "./components/page/page.js";
import { compareDict, generateUUID } from "./shared/utilities.js";
import { Hub } from "./components/hub/hub.js";

const content = document.querySelector("#content");

const frame = new Frame(content);

const sub_frame_1 = new SubFrame();

frame.registerSubFrame(sub_frame_1);

const page1 = new Page("page-1");
const page2 = new Page("page-2");

sub_frame_1.registerPage(page1);
sub_frame_1.registerPage(page2)

page1.setTemplate((self,body)=>{
    body.innerHTML = `
    <h2>Hello World from page 1</h2>
    <input type="number"></input>
    `;

    const btn = document.createElement('button');

    btn.innerHTML = "Go to page 4"

    btn.onclick = (e) =>{
        pageNavigator(page4)
    }

    body.appendChild(btn);

    const btn_2 = document.createElement('button');

    btn_2.innerHTML = "Go to page 5"

    btn_2.onclick = (e) =>{
        pageNavigator(page5)
    }

    body.appendChild(btn_2);
})

page2.setTemplate((self,body)=>{
    body.innerHTML = `
    <h2>Hello World from page 2</h2>
    <input type="number"></input>
    `;
});

sub_frame_1.setTemplate((self,body,page)=>{

    let tabs = document.createElement('div');

    for (let i = 0; i < self.pages.length; i++) {
        const page = self.pages[i];

        const tab = document.createElement('button');

        tab.innerText = page.data["name"];

        tab.onclick = (e) =>{
            self.goToPageExplicit(page);
        }

        tabs.appendChild(tab);
    }

    body.appendChild(tabs);
    body.appendChild(page.getBody());
});

const sub_frame_2 = new SubFrame();

frame.registerSubFrame(sub_frame_2);

const page3 = new Page("page-3");
const page4 = new Page("page-4");

sub_frame_2.registerPage(page3);
sub_frame_2.registerPage(page4)

page3.setTemplate((self,body,data)=>{
    body.innerHTML = `
    <h2>Hello World from page 3</h2>
    <input type="number"></input>
    `;
})

page4.setTemplate((self,body,data)=>{
    body.innerHTML = `
    <h2>Hello World from page 4</h2>
    <input type="number"></input>
    `;
});

sub_frame_2.setTemplate((self,body,page)=>{

    let tabs = document.createElement('div');

    for (let i = 0; i < self.pages.length; i++) {
        const page = self.pages[i];

        const tab = document.createElement('button');

        tab.innerText = page.data["name"];

        tab.onclick = (e) =>{
            self.goToPageExplicit(page);
        }

        tabs.appendChild(tab);
    }

    body.appendChild(tabs);
    body.appendChild(page.getBody());
});

const sub_frame_3 = new SubFrame();

frame.registerSubFrame(sub_frame_3);

const page5 = new Page("page-5",true);
const page6 = new Page("page-6");

sub_frame_3.registerPage(page5);
sub_frame_3.registerPage(page6)

page5.setTemplate((self,body,data)=>{
    body.innerHTML = `
    <h2>Hello World from page 5</h2>
    <input type="number"></input>
    `;

    const btn = document.createElement('button');

    btn.innerHTML = "Go to page 4"

    btn.onclick = (e) =>{
        pageNavigator(page4)
    }

    body.appendChild(btn);
})

page6.setTemplate((self,body,data)=>{
    body.innerHTML = `
    <h2>Hello World from page 6</h2>
    <input type="number"></input>
    `;
});

sub_frame_3.setTemplate((self,body,page)=>{

    let tabs = document.createElement('div');

    for (let i = 0; i < self.pages.length; i++) {
        const page = self.pages[i];

        const tab = document.createElement('button');

        tab.innerText = page.data["name"];

        tab.onclick = (e) =>{
            self.goToPageExplicit(page);
        }

        tabs.appendChild(tab);
    }

    body.appendChild(tabs);
    body.appendChild(page.getBody());
});


frame.setTemplate((self,body,subFrame)=>{
    let subframes = document.createElement('div');
    const backward = document.createElement('button');

    backward.innerHTML = "<";
    backward.onclick = (e) =>{
        self.popSubFrame();
    }
    subframes.appendChild(backward);

    const forward = document.createElement('button');
    forward.innerHTML = ">";
    forward.onclick = (e) =>{
        self.pushSubFrame();
    }
    subframes.appendChild(forward);
    
    body.appendChild(subframes);

    body.appendChild(subFrame.data["body"]);
});


const hub = new Hub();

hub.setParentElement(content);

hub.registerFrame(frame);

const frame_2 = new Frame();

hub.registerFrame(frame_2);

frame_2.setTemplate((self,body,subFrame)=>{
    console.log(body);
    body.innerHTML = `Hello from frame 2`;
});


hub.render();

// hub.goToFrame(frame_2);

// pageNavigator(page2);
// // pageNavigator(page3);
// pageNavigator(page4);




