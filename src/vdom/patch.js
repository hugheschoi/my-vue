export function patch (oldVnode, vnode) {
  let el = createElm(vnode)
  let parentElm = oldVnode.parentNode
  parentElm.insertBefore(el, oldVnode.nextSibling)
  parentElm.removeChild(oldVnode)
}

function createElm (vnode) {
  let {tag,children,key,data,text} = vnode;
    if(typeof tag == 'string'){ // 创建元素 放到vnode.el上
        vnode.el = document.createElement(tag);
        children.forEach(child=>{ // 遍历儿子 将儿子渲染后的结果扔到父亲中
            vnode.el.appendChild(createElm(child));
        })
    }else{ // 创建文件 放到vnode.el上
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}