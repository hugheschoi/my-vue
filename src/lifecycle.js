import { patch } from "./vdom/patch";
import { callHook } from "./util";
export function lifeCycleMixin (Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    patch(vm.$el, vnode)
  }
}

export function mountComponent (vm, el) {
  callHook(vm, 'beforeMount')
  vm._update(vm._render())
  callHook(vm, 'mounted')
}
