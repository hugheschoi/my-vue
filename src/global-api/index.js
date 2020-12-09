import { mergeOptions } from "../util"

// 全局api
export function initGlobalApi (Vue) {
  Vue.options = {}
  // 要将mixin合并到去全局配置中
  Vue.mixin = function(mixin) {
    this.options = mergeOptions(this.options, mixin)
  }
}