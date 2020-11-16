const oldArrayProtoMethods = Array.prototype

export let arrayMethods = Object.create(oldArrayProtoMethods)
let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
]
methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    const result = arrayMethods[method].apply(this, args)
    let inserted
    let ob = this.__ob__ // this指向的是调用着，也就是数组类型的data，在Observer包装data的时候，就初始化来__ob__给data， 所以这个data有__ob__属性， 指向的是Observer, 就有observeArray的方法来
    switch (method) {
      case 'push': // arr.push({a:1},{b:2})
      case 'unshift': //这两个方法都是追加 追加的内容可能是对象类型，应该被再次进行劫持
          inserted = args;
          break;
      case 'splice': // vue.$set原理
          inserted = args.slice(2); // arr.splice(0,1,{a:1},{a:1},{a:1})
      default:
          break;
    }
    if(inserted) ob.observeArray(inserted); // 给数组新增的值也要进行观测
    return result
  }
})