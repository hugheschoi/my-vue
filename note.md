## 手写Vue核心源码

### 数据劫持

1. 挂在$options到实例哈上, 初始化state，代理data
2. Object.defineProperty 劫持data，并用Observer类递归包装data

### 模版编译

1. 判断options中有没有render，没有就用template，再没有就用el.outerHTML

2. 将template转成ast语法树，*js对象描述dom节点的，用js更方便后面操作*

3. 将ast转成成Vue能解析的渲染代码

   *这样在render函数执行时，会用vue原型上的方法去编译render函数*

4. 通过new Function + with ，将render code转成render函数，并返回render函数，挂在option上

### 初次渲染

1. 引入插件renderMixin 这是用于解析render函数的， 比如render函数中的```_c, _v, _s, _render```等方法

2. 执行render函数，会得到vnode，也就是虚拟dom，通过```_render()```方法得到虚拟dom

   ```js
   Vue.prototype._render = function () {
     const vm = this
     const render = vm.$options.render
     const vnode = render.call(vm)
     return vnode
   }
   // render函数内容长这样
   // _c('div',{},_v(),_c())
   ```

   render执行的过程中就用到了以下几个方法

   ```js
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
   ```

   

3. 引入liftCycleMixin，在解析完成之后，则需要挂载元素到页面上，mountComponent就在这里。

   ```js
   vm._update(vm._render())
   vm._render()将得到的是vnode， 得到的vnode要拿去挂载
   ```

4. 挂载元素或更新元素前，会经过patch的方法，他会对vnode进行比对和挂载操作
5. 



