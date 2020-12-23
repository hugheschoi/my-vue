import { isReservedTag } from "../util";

export function renderMixin(Vue) { // 用对象来描述dom的解构
  Vue.prototype._c = function() { // 创建虚拟dom元素
      return createElement(this, ...arguments);
  }

  // 1.当结果是对象时 会对这个对象取值
  Vue.prototype._s = function(val) { // stringify
      return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val;
  }
  Vue.prototype._v = function(text) { // 创建虚拟dom文本元素
      return createTextVnode(text);
  }
  Vue.prototype._render = function() { // _render = render
      const vm = this;
      const render = vm.$options.render;
      let vnode = render.call(vm);
      return vnode;
  }
}
// _c('div',{},_v(),_c())
function createElement(vm, tag,data={},...children){
  if (isReservedTag(tag)) {
    return vnode(tag,data,data.key,children)
  }
  // 如果是组件，产生虚拟节点时需要把组件的构造函数传入, new VueCompnent().$mount
  let Ctor = vm.$options.components[tag]
  return createCompnent(vm, tag, data, data.key, children, Ctor)
}

function createCompnent (vm, tag, data, key, children, Ctor) {
  // 组件的children是chachao
  const baseCtor = vm.$options._base // Vue构造器
  // Ctor可能是对象，也可能是构造函数
  if (typeof Ctor === 'object') {
    Ctor = baseCtor.extend(Ctor) // 返回一个Vuecomponet构造函数（继承Vue构造函数）
  }
  // 给组件增加生命周期
  data.hook = { // 稍后初始化，会调用init
    init () {}
  }
  return vnode(`vue-compnent-${Ctor.cid}-${tag}`, data, key, undefined, undefined, {
    Ctor, children
  })
}

function createTextVnode(text){
  return vnode(undefined,undefined,undefined,undefined,text);
}
// 用来产生虚拟dom的,操作真实dom浪费性能
function vnode(tag,data,key,children,text){
  return {
      tag,
      data,
      key,
      children,
      text,
  }
}