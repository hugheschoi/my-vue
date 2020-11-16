import { proxy } from "./util"
import { observe } from "./observer/index"

export function initState(vm) {
  const opt = vm.$options
  if (opt.props) {
    initProps(vm)
  }
  if (opt.data) {
    initData(vm)
  }
}
function initProps(){}
function initData(vm) { // 数据初始化
  let data = vm.$options.data
  vm._data = data = typeof data === 'function' ? data.call(vm) : data
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  observe(data)
}