import { nextTick, proxy } from "./util"
import { observe } from "./observer/index"
import Watcher from "./observer/watcher"
import Dep from "./observer/dep";

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
  if (opts.computed) {
    initComputed(vm)
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

function initComputed (vm) {
  let computed = vm.$options.computed
  const watchers = vm._computedWathcers = {} // computed的watcher
  for (let key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true })
    defineComputed(vm, key, userDef) // defineReactive()
  }
}

function defineComputed (vm, key, userDef) {
    const definition = {
        enumerable: true, // 是否可枚举
        configurable: true,
        get: () => {},
        set: () => {}
    }
    if (typeof userDef == 'function') {
        definition.get = createComputedGetter(key)
    } else {
        definition.get = createComputedGetter(key)
        definition.set = userDef.set
    }
    Object.defineProperty(vm, key, definition)
    console.log(vm)
}
function createComputedGetter (key) {
  return function () {
    const watcher = this._computedWathcers[key]

    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate() // 对当前watcher求值
      }
      if (Dep.target) { // 说明还有渲染watcher，也应该一并的收集起来
        watcher.depend()
      }
      return watcher.value // 默认返回watcher上存的值
    }
  }
}