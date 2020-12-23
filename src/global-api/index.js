import { mergeOptions } from "../util"
import initExtend from "./extend";

// 全局api
export function initGlobalApi (Vue) {
  Vue.options = {}
  // 要将mixin合并到去全局配置中
  Vue.mixin = function(mixin) {
    this.options = mergeOptions(this.options, mixin)
  }
  /*
   Vue.component('my-button', {
    name: 'my-button',
    template:'<button>{{a}}</button>',
    created(){
      console.log('child created')
    },
    ...
   })
   */
  Vue.options._base = Vue
  Vue.options.components = {}
  initExtend(Vue)

  // initAssetRegisters....  directive filter
  Vue.component = function (id,definition) {
    // Vue.extend 
    definition.name = definition.name || id; // 默认会以name属性为准
    // 根据当前组件对象 生成了一个子类的构造函数
    // 用的时候得 new definition().$mount()
    definition = this.options._base.extend(definition); // 永远是父类

    // Vue.component 注册组件 等价于  Vue.options.components[id] = definition
    Vue.options.components[id] = definition;
  }
}
