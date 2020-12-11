// depend依赖, 收集依赖的
let id = 0
class Dep {
  constructor () {
    this.subs = []
    this.id = id++
  }
  // 建立关联，依赖关系
  depend () {
    Dep.target.addDep(this)
  }
  // 往中介添加
  addSub (watcher) {
    this.subs.push(watcher)
  }
  // 通知
  notify () {
    this.subs.forEach(watcher => watcher.update())
  }
}
Dep.target = null;
export function pushTarget (watcher) {
  Dep.target = watcher
}

export function popTarget () {
  Dep.target = null
}
export default Dep