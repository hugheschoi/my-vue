import { initState } from "./state"
import { compileToFunctions } from "./compiler/index"
import { mountComponent } from "./lifecycle";
import { mergeOptions, callHook } from "./util";
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this // 实例
    // 要把全局的合并一起
    vm.$options = mergeOptions(vm.constructor.options, options) // 属性挂在实例的$options
    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')
    if(vm.$options.el){
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);
    if(!options.render){
      // 没render 将template转化成render方法
      let template = options.template;
      if(!template && el){
          template = el.outerHTML;
      }
      // 编译原理 将模板编译成render函数
      const render = compileToFunctions(template);
      options.render = render
    }
    // 都解析成render函数之后，挂载组件
    mountComponent(vm,el);
  }
}
