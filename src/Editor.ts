
interface EditorConfig{
    height:number;
}

export class Editor{

    root:HTMLElement;
    config:EditorConfig = {
        height:500
    };

    constructor(root:string){
        this.root = document.getElementById(root);
    }

    create(){
        let toolsBar = document.createElement('div')
        toolsBar.id = 'toolsbar';
        let editorArea = document.createElement('div')
        editorArea.id = 'editorarea';
        editorArea.style.height = ''+this.config.height+'px';
        this.root.appendChild(toolsBar);
        this.root.appendChild(editorArea);
    }
}