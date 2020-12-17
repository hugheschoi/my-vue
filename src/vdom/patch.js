export function patch(oldVnode,vnode){
    // oldVnode => id#app   vnode 我们根据模板产生的虚拟dom
    // 将虚拟节点转化成真实节点
    if (oldVnode.nodeType === 1) {
        let el = createElm(vnode); // 产生真实的dom 
        let parentElm = oldVnode.parentNode; // 获取老的app的父亲 =》 body
    
        parentElm.insertBefore(el,oldVnode.nextSibling); // 当前的真实元素插入到app的后面
        parentElm.removeChild(oldVnode); // 删除老的节点
        return el;
    } else {
        // 在更新的时 拿老的虚拟节点 和 新的虚拟节点做对比 ，将不同的地方更新真实的dom
        // 更新功能
        // 那当前节点 整个
        // 1.比较两个元素的标签 ，标签不一样直接替换掉即可 parentNode.replaceChild(newel, oldel)
        if (oldVnode.tag !== vnode.tag) {
            return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
        }
        // 剩下的是标签一样的
        // 2.有种可能是标签一样 <div>1</div>   <div>2</div>
        //  文本节点的虚拟节点tag 都是undefined 文本替换用 DOMElemnt.textContent = newVal
        if (!oldVnode.tag) {
            if (oldVnode.text !== vnode.text) {
                return oldVnode.el.textContent= vnode.text
            }
        }
        // 3.其他情况 开始比对标签的属性 和 儿子了
        // 可以复用老节点了，el是一个DOMElement对象，只改变el里属性或者孩子即可
        // 所以可以把老vnode的el赋值给新vnode
        let el = vnode.el = oldVnode.el
        // 3.1 更新属性，用新的虚拟节点的属性和老的比较，去更新节点
        // 新老属性做对比
        updateProperties(vnode, oldVnode.data)
        return el
    }

}
// 
/**
 * tag,children,key,data,text vnode上的几个属性
 * @param {Object} vnode 虚拟节点
 */
export function createElm(vnode){
    let {tag,children,key,data,text} = vnode;
    if(typeof tag == 'string'){ // 创建元素 放到vnode.el上
        vnode.el = document.createElement(tag);
        // 只有元素才有属性
        updateProperties(vnode);
        children.forEach(child=>{ // 遍历儿子 将儿子渲染后的结果扔到父亲中
            vnode.el.appendChild(createElm(child));
        })
    }else{ // 创建文件 放到vnode.el上
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}

// vue 的渲染流程 =》 先初始化数据 =》 将模板进行编译 =》 render函数 =》 生成虚拟节点 =》 生成真实的dom  =》 扔到页面上

/**
 * 
 * @param {*} vnode 
 * @param {*} oldProps 旧节点的属性对象 oldVnode.data
 */
function updateProperties(vnode, oldProps = {}){
    let newProps = vnode.data || {}
    let el = vnode.el;
    // 1. 老得有，新的没有 删掉老得 DOMElement.removeAttribute()
    for (let key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute(key)
        }
    }
    // 2. 比对样式
    let newStyle = newProps.style || {}
    let oldStyle = oldProps.style || {}
    // 老的样式中有 新的没有 删除老的样式
    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style[key] = '';
        }
    }
    // 2. 老得没有，新的有 那就直接用新的去做更新即可
    for(let key in newProps){
        if(key == 'style'){ // {color:red}
            for(let styleName in newProps.style){
                el.style[styleName] = newProps.style[styleName]
            }
        }else if(key == 'class'){
            el.className = newProps.class;
        }else{
            el.setAttribute(key,newProps[key]);
        }
    }
}