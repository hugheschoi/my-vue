import { nextTick } from "../util"
import Watcher from "./watcher";

let has = {}
let queue = []
let pending = false;
export function queueWatcher(watcher) {
  let id = watcher
  if (has[id] ==null) {
    queue.push(watcher)
    has[id] = true
    // 开启异步，会等待所有同步后再执行
    // setTimeout(() => {
    //   flushSchedulerQueue()
    // }, 0)
    if (!pending) {
        nextTick(flushSchedulerQueue)
        pending = true
    }
  }
}

export function flushSchedulerQueue () {
  queue.forEach(watcher =>{
    watcher.run()
    if (!watcher.user) {
        watcher.cb()
    }
  });
  queue = [];
  has = {};
  pending = false
}