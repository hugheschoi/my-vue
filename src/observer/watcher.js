// 观察者.js
import { pushTarget, popTarget } from "./dep";
class Watcher {
  constructor (vm, exprOrFn, cb, options) {
    this.deps = [] // watcher记录有多少dep依赖他
    this.depsId = new Set()
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb
    this.options = options
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    this.value = this.get()
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
  run () {
    this.get()
  }
  update () {
    this.run()
  }
}

export default Watcher
