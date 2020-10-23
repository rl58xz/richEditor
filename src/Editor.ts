interface EditorConfig{
    bold:string;
    title:string[];
}

// interface EditorProps{
//     root:HTMLDivElement;
//     config:EditorConfig;
// }

export class Editor{

    //挂载的父节点
    public root:HTMLDivElement;

    //执行操作的目标range --- 用于window.section()设定所选区域
    private range:Range;
    //工具栏
    private toolsBar:HTMLDivElement;
    //用户编辑区域
    private editorArea:HTMLDivElement;

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
        this.toolsBar = document.createElement('div');
        this.toolsBar.id = 'toolsbar';
        this.toolsBar.style.borderBottom = '1px solid #eee';
        this.toolsBar.style.height = '40px';
        this.toolsBar.style.width = 'inherit';

        //读取配置，创建功能按钮
        let toolsBarItemdf = document.createDocumentFragment();
        for(let key of Object.keys(this.config)){
            let item = document.createElement('div');
            item.classList.add('toolsitem');
            item.classList.add('editorfundition');
            item.style.display = 'inline-block';
            item.style.height = 'inherit';
            item.style.lineHeight = '40px';
            item.style.width = '40px';
            item.style.textAlign = 'center';
            item.textContent = String(this.config[key].title);
            if(this.config[key].command){
                item.dataset.command = this.config[key].command;
                if(this.config[key].params) item.dataset.params = this.config[key].params;
                else item.dataset.params = null;
            }
            if(this.config[key].children){
                item.style.position = 'relative';
                let submenucontainer:HTMLElement = document.createElement('div');
                // submenucontainer.style.display = 'none';
                submenucontainer.style.position = 'absolute';
                submenucontainer.style.left = '0';
                submenucontainer.style.top = '1.7em';
                submenucontainer.classList.add('submenucontainer')
                //无序列表下拉菜单
                let submenuul = document.createElement('ul');
                submenuul.style.listStyleType = 'none';
                submenuul.style.paddingLeft = '0';
                submenuul.style.border = '1px solid #999'
                for(let obj of this.config[key].children){
                    let subMenuItem = document.createElement('li');
                    //设置内容
                    subMenuItem.textContent = obj.title || '';
                    //设置样式
                    subMenuItem.style.backgroundColor = '#eee';
                    subMenuItem.style.display = 'block';
                    subMenuItem.style.padding = '0.1em 1.5em';
                    subMenuItem.style.borderTop = '1px solid #999';
                    if(String(obj.params).indexOf('#') > -1) subMenuItem.style.color = obj.params;
                    subMenuItem.classList.add("editorfundition");
                    //设置dataset属性
                    subMenuItem.dataset.command = obj.command;
                    subMenuItem.dataset.params = obj.params;
                    submenuul.appendChild(subMenuItem);
                }
                submenucontainer.appendChild(submenuul);
                item.appendChild(submenucontainer);
            }
            toolsBarItemdf.appendChild(item);
        }
        this.toolsBar.appendChild(toolsBarItemdf);

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

        //设置点击事件
        this.editorArea.onkeydown = () => {
            var str = this.editorArea.innerHTML;
            var val = str.search(/<\/li>/i);
            if(val < 0){
                document.execCommand("formatblock", false, "p");
            }
            //更新编辑区域的最后操作的range
            this.range.selectNode(this.editorArea.lastChild);
        }

        //为各个功能按钮添加事件
        let funditionButtons:HTMLCollection = document.getElementsByClassName('editorfundition');
        for(let i = 0; i < funditionButtons.length; i++){
            let funditionButton:HTMLElement = funditionButtons[i] as HTMLElement;
            funditionButton.addEventListener('click',(e) => {
                e.preventDefault();
                let section = window.getSelection ? window.getSelection() : document.getSelection();
                // console.log(section.getRangeAt(0));
                section.removeAllRanges();
                section.addRange(this.range);
                let result:boolean;
                if(funditionButton.dataset.params) result = document.execCommand(funditionButton.dataset.command,false,funditionButton.dataset.params);
                else result = document.execCommand(funditionButton.dataset.command);
            })
        }

        //编辑区域鼠标事件处理
        this.editorArea.addEventListener('mouseup',()=>{
            let section = window.getSelection ? window.getSelection() : document.getSelection();
            this.range = section.getRangeAt(0);
        })

        //初始化编辑区域
        this.editorArea.focus();
        document.execCommand("formatblock", false, "p");
        this.range = document.createRange();
        this.range.selectNodeContents(this.editorArea);
    }
}