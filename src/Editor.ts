interface EditorConfig{
    bold:string;
    title:string[];
}

export class Editor{

    root:HTMLDivElement;
    config = {
        bold:{
            title:'B',
            command:'bold'
        },
        title:['h1','h2','h3','h4','h5','normal'],
    };

    //初始化
    constructor(root:string){
        //设置挂载div边框
        this.root = document.getElementById(root) as HTMLDivElement;
        this.root.style.border = '1px solid #eee';
        //增加全局样式
        let style:HTMLStyleElement = document.createElement('style');
        style.innerHTML = '.toolsitem:hover{background-color:#ddd}'
        document.head.appendChild(style);
    }

    create(){
        //创建文档片段
        let df:DocumentFragment = new DocumentFragment();

        //工具条创建
        let toolsBar:HTMLDivElement = document.createElement('div');
        toolsBar.id = 'toolsbar';
        toolsBar.style.borderBottom = '1px solid #eee'
        for(let key of Object.keys(this.config)){
            let item = document.createElement('div');
            item.classList.add('toolsitem');
            item.classList.add('editorfundition')
            item.style.display = 'inline-block';
            item.style.height = 'inherit';
            item.style.lineHeight = '2.5em';
            item.style.width = '2.5em';
            item.style.textAlign = 'center';
            item.textContent = String(this.config[key].title);
            item.dataset.command = this.config[key].command;
            if(this.config[key].params) item.dataset.params = this.config[key].params;
            else item.dataset.params = null;
            // if(this.config[key] instanceof Array){
            //     let subMenu = document.createElement('ul');
            //     for(let liitem of this.config[key]){
            //         let subMenuItem = document.createElement('li');
            //         subMenuItem.textContent = String(liitem);
            //         subMenu.appendChild(subMenuItem);
            //     }
            //     item.appendChild(subMenu);
            // }
            toolsBar.appendChild(item);
        }

        //编辑区域创建
        let editorArea:HTMLDivElement = document.createElement('div');
        editorArea.setAttribute('id',"editorarea");
        editorArea.contentEditable = 'true';

        //挂载到页面
        df.appendChild(toolsBar);
        df.appendChild(editorArea);
        this.root.appendChild(df);

        //设置点击事件
        let funditionButtons:HTMLCollection = document.getElementsByClassName('editorfundition');
        for(let i = 0; i < funditionButtons.length; i++){
            let funditionButton:HTMLElement = funditionButtons[i] as HTMLElement;
            funditionButton.addEventListener('click',()=>{
                if(window.getSelection){
                    let range = window.getSelection();
                    console.log(range);
                }
                document.execCommand(funditionButton.dataset.command,false,funditionButton.dataset.params);
            })
        }
    }
}