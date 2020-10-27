interface ToolsConfig {
}

export function renderToolsBar(config: any): HTMLDivElement {
    // let toolsBarDf:DocumentFragment = document.createDocumentFragment();
    let toolsBar: HTMLDivElement = document.createElement('div');
    toolsBar.id = 'toolsbar';
    toolsBar.style.borderBottom = '1px solid #eee';
    toolsBar.style.height = '40px';
    toolsBar.style.width = 'inherit';

    //读取配置，创建功能按钮
    let toolsBarItemdf = document.createDocumentFragment();
    for (let key of Object.keys(config)) {
        let item:HTMLDivElement = document.createElement('div');
        item.classList.add('toolsitem');
        item.classList.add('editorfundition');
        item.style.display = 'inline-block';
        item.style.height = 'inherit';
        item.style.lineHeight = '40px';
        item.style.width = '40px';
        item.style.textAlign = 'center';
        item.style.cursor = 'pointer';
        item.textContent = String(config[key].title);
        if (config[key].command) {
            item.dataset.command = config[key].command;
            if (config[key].params) item.dataset.params = config[key].params;
            else item.dataset.params = null;
        }
        if (config[key].children) {
            item.style.position = 'relative';
            let submenucontainer: HTMLElement = document.createElement('div');
            // submenucontainer.style.display = 'none';
            submenucontainer.style.position = 'absolute';
            submenucontainer.style.left = '0';
            submenucontainer.style.top = '1.7em';
            submenucontainer.classList.add('submenucontainer')
            //无序列表下拉菜单
            let submenuul:HTMLUListElement = document.createElement('ul');
            submenuul.style.listStyleType = 'none';
            submenuul.style.paddingLeft = '0';
            submenuul.style.border = '1px solid #999'
            for (let obj of config[key].children) {
                let subMenuItem:HTMLLIElement = document.createElement('li');
                //设置内容
                subMenuItem.textContent = obj.title || '';
                //设置样式
                subMenuItem.style.backgroundColor = '#eee';
                subMenuItem.style.display = 'block';
                subMenuItem.style.padding = '0.1em 1.5em';
                subMenuItem.style.borderTop = '1px solid #999';
                subMenuItem.style.cursor = 'pointer';
                if (String(obj.params).indexOf('#') > -1) subMenuItem.style.color = obj.params;
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
    toolsBar.appendChild(toolsBarItemdf);
    return toolsBar;
}
