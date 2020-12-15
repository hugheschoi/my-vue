export function proxy (vm, data, key) {

  Object.defineProperty(vm, key, {
    get () {
      return vm[data][key]
    },
    set (val) {
      vm[data][key] = val
    }
  })
}

export function defineProperty (target, key, value) {
  Object.defineProperty(target, key, {
    enumerable: false,
    configurable: false,
    value
  })
}
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]
const strats = {}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

function mergeHook (parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  }
}

export function mergeOptions (parent, child) {
  const options = {}
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key])
    } else {
      options[key] = child[key]
    }
  }
  return options
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach(handler => {
      handler.call(vm)
    })
  }
}



const callbacks = [];
let pending = false;
function flushCallbacks(){
    console.log('callbacks', callbacks)
    while (callbacks.length) {
        let cb = callbacks.shift();
        cb();
    } // 让nextTick中传入的方法依次执行
    pending = false // 标识已经执行完毕
}
let timerFunc;
if(Promise){
    timerFunc = ()=>{
        Promise.resolve().then(flushCallbacks); // 异步处理更新
    }
}else if(MutationObserver){ // 可以监控dom变化,监控完毕后是异步更新
    let observe = new MutationObserver(flushCallbacks);
    let textNode = document.createTextNode(1); // 先创建一个文本节点
    observe.observe(textNode,{characterData:true}); // 观测文本节点中的内容
    timerFunc = ()=>{
        textNode.textContent = 2; // 文中的内容改成2
    }
}else if(setImmediate){
    timerFunc = ()=>{
        setImmediate(flushCallbacks)
    }
}else{
    timerFunc = ()=>{
        setTimeout(flushCallbacks)
    }
}
export function nextTick(cb){ // 因为内部会调用nextTick 用户也会调用，但是异步只需要一次
    callbacks.push(cb);
    if(!pending){
        // vue3 里的nextTick原理就是promise.then 没有做兼容性处理了
        timerFunc();// 这个方法是异步方法 做了兼容处理了
        pending = true;
    }
}