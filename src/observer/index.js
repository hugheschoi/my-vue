import { defineProperty } from "../util";
import { arrayMethods } from "./array";
import Dep from './dep'

export function observe(data) {
  if(typeof data !== 'object' || data == null){
      return;
  }
  if(data.__ob__){
      return data;
  }
  return new Observer(data) // 包装data
}

class Observer {
  constructor (data) {
    this.dep = new Dep()
    defineProperty(data, '__ob__', this)
    if (Array.isArray(data)) {
      data.__proto__ = arrayMethods
      this.observeArray(data)
    }
    this.walk(data)
  }
  walk(data) {
    const keys = Object.keys(data)
    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
  observeArray (data) {
    for(let i = 0; i < data.length;i++) {
      observe(data[i])
    }
  }
}
function defineReactive(data, key, value) {
  let valueObserver = observe(value)
  const dep = new Dep()
  Object.defineProperty(data, key, {
    get () {
      console.log(key, Dep.target)
      if (Dep.target) {
        dep.depend()
        if (valueObserver) {
          valueObserver.dep.depend()
        }
      }
      return value
    },
    set (newValue) {
      if(newValue === value) return;
      observe(newValue)
      value = newValue
      dep.notify()
    }
  })
}