// 观察者.js
import { pushTarget, popTarget } from "./dep";
import { queueWatcher } from "./schduler";
class Watcher {
  constructor (vm, exprOrFn, cb, options) {
    this.deps = [] // watcher记录有多少dep依赖他
    this.depsId = new Set()
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb
    this.options = options
    /**
     * var obj = true; obj.user // undefined
     */
    this.user = options.user
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    } else {
      this.getter = function() {
        // 拿到实例上的值
        let path = exprOrFn.split('.')
        let obj = vm
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]]
        }
        return obj
      }
    }
    this.value = this.get() // 默认先调用一次get，进行取值，将结果赋值给this.value
    // 比如 vm.a.a 的值
  }
  get () {
    pushTarget(this)
    let result = this.getter()
    popTarget()
    return result
  }

  addDep (dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)
    }
  }
  // 更新值后，批量更新最后会走到run
  // 如果是watch，那么this.value是老值，this.get()是新值
  run () {
    // this.get()
    console.log('run')
    let newValue = this.get()
    let oldValue = this.value
    this.value = newValue
    if (this.user) { // 如果是用户watcher
      this.cb.call(this.vm, newValue, oldValue)
    }
  }
  update () {
    console.log('update', this)
    // this.run()
    queueWatcher(this)
  }
}



export default Watcher
