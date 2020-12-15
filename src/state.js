import { nextTick, proxy } from "./util"
import { observe } from "./observer/index"
import Watcher from "./observer/watcher"

export function initState(vm) {
  const opts = vm.$options
  if (opts.props) {
    initProps(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.watch) {
    initWatch(vm)
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

function initWatch(vm) {
  let watch = vm.$options.watch
  for(let key in watch){
    const handler = watch[key]; // handler可能是 
    if(Array.isArray(handler)){ // 数组 、
        handler.forEach(handle=>{
            createWatcher(vm,key,handle);
        });
    }else{
        createWatcher(vm,key,handler); // 字符串 、 对象 、 函数
    }
  }
}
/**
 *   可能是一个函数，所以key就叫它exprOrFn好老
 *      vm.$watch(()=>{
            return vm.a.a.a; // 老值
        },(newValue,oldValue)=>{
            console.log(newValue,oldValue,'自己写的$watch')
        })
 */
// options 可以用来标识 是用户watcher
function createWatcher (vm, exprOrFn, handler, options) {
  if(typeof handler == 'object'){
    options = handler
    handler = handler.handler; // 是一个函数
  }
  if(typeof handler == 'string'){ // methods的情况
      handler = vm[handler]; // 将实例的方法作为handler
  }
  // key handler 用户传入的选项
  return vm.$watch(exprOrFn,handler,options)
}

export function stateMixin(Vue){
  Vue.prototype.$nextTick = function (cb) {
      nextTick(cb);
  }
  Vue.prototype.$watch = function (exprOrFn,cb,options = {}) {
    console.log('$watch', this)
      // 数据应该依赖这个watcher  数据变化后应该让watcher从新执行
      let watcher = new Watcher(this,exprOrFn,cb,{...options,user:true});
      if(options.immediate){
          cb(); // 如果是immdiate应该立刻执行
      }
  }
}