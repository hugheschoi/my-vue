export function renderMixin (Vue) {
  Vue.prototype._c = function (){
    return createElement(...arguments)
  }
  Vue.prototype._s = function(val) { // stringify
    return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val;
  }
  Vue.prototype._v = function(text) { // 创建虚拟dom文本元素
      return createTextVnode(text);
  }
  Vue.prototype._render = function (){
    const vm = this // Vue的实例有_render方法调用_render所以this是vue
    const render= vm.$options.render // $options挂上了所有得到属性
    let vnode = render.call(vm)
    return vnode
  }
}
// _c('div',{},_v(),_c())
function createElement(tag,data={},...children){
  return vnode(tag,data,data.key,children)
}
function createTextVnode(text){
  return vnode(undefined,undefined,undefined,undefined,text);
}
function vnode(tag,data,key,children,text){
  return {
      tag,
      data,
      key,
      children,
      text
  }
}