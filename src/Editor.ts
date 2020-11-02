import {renderToolsBar} from './render/renderToolsBar';

interface EditorInterface{
    create():void;
}

interface Window{
    range:Range;
}

export class Editor implements EditorInterface{

    //挂载的父节点
    public root:HTMLDivElement;

    //执行操作的目标range --- 用于window.section()设定所选区域
    private range:Range;
    //工具栏
    private toolsBar:HTMLDivElement;
    //用户编辑区域
    private editorArea:HTMLDivElement;

    private nodeName:string;

    //功能配置
    public config = {
        bold:{
            title:'B',
            command:'bold'
        },
        title:{
            title:'标题',
            children:[
                {
                    title:'h1',
                    command:'formatblock',
                    params:'H1'
                },
                {
                    title:'h2',
                    command:'formatblock',
                    params:'H2'
                },
                {
                    title:'h3',
                    command:'formatblock',
                    params:'H3'
                },
                {
                    title:'h4',
                    command:'formatblock',
                    params:'H4'
                },
                {
                    title:'h5',
                    command:'formatblock',
                    params:'H5'
                },
                {
                    title:'正文',
                    command:'formatblock',
                    params:'p'
                }
            ]
        },
        color:{
            title:'颜色',
            children:[
                {
                    title:'red',
                    command:'forecolor',
                    params:'#ff0000'
                },
                {
                    title:'green',
                    command:'forecolor',
                    params:'#00ff00'
                },
                {
                    title:'blue',
                    command:'forecolor',
                    params:'#0000ff'
                },
            ]
        }
    };

    //初始化
    constructor(root:string){
        //设置挂载div边框
        this.root = document.getElementById(root) as HTMLDivElement;
        this.root.style.border = '1px solid #eee';
        //增加全局样式
        let style:HTMLStyleElement = document.createElement('style');
        style.innerHTML = '.toolsitem:hover{background-color:#ddd}.toolsitem:hover .submenucontainer{display:block}.submenucontainer{display:none}'
        document.head.appendChild(style);
    }

    public create(){
        //创建文档片段
        let df:DocumentFragment = new DocumentFragment();

        //工具条创建
        this.toolsBar = renderToolsBar(this.config);

        //编辑区域创建
        this.editorArea = document.createElement('div');
        this.editorArea.setAttribute('id',"editorarea");
        this.editorArea.contentEditable = 'true';
        this.editorArea.style.height = 'calc(100% - 40px)';
        this.editorArea.style.width = 'inherit';
        this.editorArea.style.overflowY = 'scroll';

        //挂载到页面
        df.appendChild(this.toolsBar);
        df.appendChild(this.editorArea);
        this.root.appendChild(df);

        //设置键盘输入事件
        this.editorArea.onkeydown = () => {
            //更新编辑区域的最后操作的range
            let section = window.getSelection ? window.getSelection() : document.getSelection();
            this.range = section.getRangeAt(0);
        }
        
        //处理回车，默认插入p标签
        this.editorArea.onkeyup = (e) => {
            if(e.key === 'Enter') document.execCommand("formatblock", false, 'p');
        }

        //为各个功能按钮添加事件
        let funditionButtons:HTMLCollection = document.getElementsByClassName('editorfundition');
        for(let i = 0; i < funditionButtons.length; i++){
            let funditionButton:HTMLElement = funditionButtons[i] as HTMLElement;
            let command = funditionButton.dataset.command;
            let params = funditionButton.dataset.params || "";
            if(command === 'bold'){
                funditionButton.addEventListener('click',(e) => {
                    e.preventDefault();
                    let section = window.getSelection ? window.getSelection() : document.getSelection();
                    section.removeAllRanges();
                    section.addRange(this.range);
                    let {startContainer,startOffset,endContainer,endOffset,collapsed} = this.range;
                    let result:boolean;
                    if(params) result = document.execCommand(command,false,params);
                    else result = document.execCommand(command);
                    if(result){
                        if(endContainer.previousSibling) this.range.selectNode(endContainer.previousSibling);
                    }
                    section.addRange(this.range);
                })
            }
            else funditionButton.addEventListener('click',() => {
                let section = window.getSelection ? window.getSelection() : document.getSelection();
                section.removeAllRanges();
                section.addRange(this.range);
                let {startContainer,startOffset,endContainer,endOffset,collapsed} = this.range;
                startContainer = startContainer.cloneNode();
                //endContainer = endContainer.cloneNode();
                let result:boolean;
                if(params) result = document.execCommand(command,false,params);
                else result = document.execCommand(command);
                if(result){
                    this.range = document.createRange();
                    this.range.setStart(startContainer,startOffset);
                    this.range.setEndBefore(endContainer);
                    console.log(this.range);
                }
            })
        }

        //编辑区域鼠标事件处理
        document.addEventListener('mouseup',(e)=>{
            let selection = window.getSelection ? window.getSelection() : document.getSelection();
            let etarget = e.target as HTMLElement;
            if(etarget.className.indexOf('editorfundition') > -1){
                // console.log(this.range);
                 //console.log(this.range.startContainer,this.range.startOffset,this.range.endContainer,this.range.endOffset);
                selection.removeAllRanges();
                selection.addRange(this.range);
                return;
            }
            // let parent:HTMLElement = (selection.anchorNode.nodeType === 1 ? selection.anchorNode : selection.anchorNode.parentElement) as HTMLElement;
            // while(parent && !(parent.className.indexOf('editorfundition') > -1)){
            //     parent = parent.parentElement;
            // }
            // if(parent && parent.className.indexOf('editorfundition') > -1 && edo.className.indexOf('editorfundition') > -1){
            //     selection.removeAllRanges();
            //     selection.addRange(this.range);
            //     return;
            // }
            this.range = selection.getRangeAt(0);
            // console.log(this.range);
            // console.log(this.range.startContainer,this.range.startOffset,this.range.endContainer,this.range.endOffset);
        })

        //初始化编辑区域
        this.editorArea.focus();
        document.execCommand("formatblock", false, "p");
        this.range = document.createRange();
        this.range.selectNodeContents(this.editorArea);
    }
}