(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[data][key];
      },
      set: function set(val) {
        vm[data][key] = val;
      }
    });
  }
  function defineProperty(target, key, value) {
    Object.defineProperty(target, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strats = {}; // parentVal 是 全局的components
  // 组件的合并策略是最近策略，先找自己的再找全局的 - 原型链！， 将全局组件放在原型链上。

  strats.components = function (parentVal, childVal) {
    var res = Object.create(parentVal);

    if (childVal) {
      for (var key in childVal) {
        res[key] = childVal[key];
      }
    }

    return res;
  };

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    }
  }

  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    function mergeField(key) {
      if (strats[key]) {
        options[key] = strats[key](parent[key], child[key]);
      } else {
        options[key] = child[key];
      }
    }

    return options;
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      handlers.forEach(function (handler) {
        handler.call(vm);
      });
    }
  }
  var callbacks = [];
  var pending = false;

  function flushCallbacks() {
    console.log('callbacks', callbacks);

    while (callbacks.length) {
      var cb = callbacks.shift();
      cb();
    } // 让nextTick中传入的方法依次执行


    pending = false; // 标识已经执行完毕
  }

  var timerFunc;

  if (Promise) {
    timerFunc = function timerFunc() {
      Promise.resolve().then(flushCallbacks); // 异步处理更新
    };
  } else if (MutationObserver) {
    // 可以监控dom变化,监控完毕后是异步更新
    var observe = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(1); // 先创建一个文本节点

    observe.observe(textNode, {
      characterData: true
    }); // 观测文本节点中的内容

    timerFunc = function timerFunc() {
      textNode.textContent = 2; // 文中的内容改成2
    };
  } else if (setImmediate) {
    timerFunc = function timerFunc() {
      setImmediate(flushCallbacks);
    };
  } else {
    timerFunc = function timerFunc() {
      setTimeout(flushCallbacks);
    };
  }

  function nextTick(cb) {
    // 因为内部会调用nextTick 用户也会调用，但是异步只需要一次
    callbacks.push(cb);

    if (!pending) {
      // vue3 里的nextTick原理就是promise.then 没有做兼容性处理了
      timerFunc(); // 这个方法是异步方法 做了兼容处理了

      pending = true;
    }
  }

  function makeMap(str) {
    var mapping = {};
    var list = str.split(',');

    for (var i = 0; i < list.length; i++) {
      mapping[list[i]] = true;
    }

    return function (key) {
      // 判断这个标签名是不是原生标签
      return mapping[key];
    };
  }

  var isReservedTag = makeMap('a,div,img,image,text,span,p,button,input,textarea,ul,li');

  var oldArrayProtoMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayProtoMethods[method].apply(this, args);
      var inserted;
      var ob = this.__ob__; // this指向的是调用着，也就是数组类型的data，在Observer包装data的时候，就初始化来__ob__给data， 所以这个data有__ob__属性， 指向的是Observer, 就有observeArray的方法来

      switch (method) {
        case 'push': // arr.push({a:1},{b:2})

        case 'unshift':
          //这两个方法都是追加 追加的内容可能是对象类型，应该被再次进行劫持
          inserted = args;
          break;

        case 'splice':
          // vue.$set原理
          inserted = args.slice(2);
      }

      if (inserted) ob.observeArray(inserted); // 给数组新增的值也要进行观测

      ob.dep.notify();
      return result;
    };
  });

  // depend依赖, 收集依赖的
  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.subs = [];
      this.id = id++;
    } // 建立关联，依赖关系


    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // Dep.target.addDep(this)
        Dep.target.addDep(this);
      } // 往中介添加

    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      } // 通知

    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null;
  function pushTarget(watcher) {
    Dep.target = watcher;
  }
  function popTarget() {
    Dep.target = null;
  }

  function observe$1(data) {
    if (_typeof(data) !== 'object' || data == null) {
      return;
    }

    if (data.__ob__) {
      return data;
    }

    return new Observer(data); // 包装data
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      this.dep = new Dep();
      defineProperty(data, '__ob__', this);

      if (Array.isArray(data)) {
        data.__proto__ = arrayMethods;
        this.observeArray(data);
      }

      this.walk(data);
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        for (var i = 0; i < data.length; i++) {
          observe$1(data[i]);
        }
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    var valueObserver = observe$1(value);
    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        console.log(key, Dep.target);

        if (Dep.target) {
          dep.depend();

          if (valueObserver) {
            valueObserver.dep.depend();
          }
        }

        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe$1(newValue);
        value = newValue;
        dep.notify();
      }
    });
  }

  var has = {};
  var queue = [];
  var pending$1 = false;
  function queueWatcher(watcher) {
    var id = watcher;

    if (has[id] == null) {
      queue.push(watcher);
      has[id] = true; // 开启异步，会等待所有同步后再执行
      // setTimeout(() => {
      //   flushSchedulerQueue()
      // }, 0)

      if (!pending$1) {
        nextTick(flushSchedulerQueue);
        pending$1 = true;
      }
    }
  }
  function flushSchedulerQueue() {
    queue.forEach(function (watcher) {
      watcher.run();

      if (!watcher.user) {
        watcher.cb();
      }
    });
    queue = [];
    has = {};
    pending$1 = false;
  }

  var id$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      this.id = id$1++;
      this.deps = []; // watcher记录有多少dep依赖他

      this.depsId = new Set();
      this.vm = vm;
      this.exprOrFn = exprOrFn;
      this.cb = cb;
      this.options = options;
      /**
       * var obj = true; obj.user // undefined
       */

      this.user = options.user;
      this.lazy = options.lazy; // lazy代表的是computed计算属性

      this.dirty = this.lazy;

      if (typeof exprOrFn === 'function') {
        this.getter = exprOrFn;
      } else {
        this.getter = function () {
          // 拿到实例上的值
          var path = exprOrFn.split('.');
          var obj = vm;

          for (var i = 0; i < path.length; i++) {
            obj = obj[path[i]];
          }

          return obj;
        };
      }

      this.value = this.lazy ? void 0 : this.get(); // 默认先调用一次get，进行取值，将结果赋值给this.value
      // 比如 vm.a.a 的值
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this);
        var result = this.getter.call(this.vm);
        popTarget();
        return result;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.deps.push(dep);
          this.depsId.add(id);
          dep.addSub(this);
        }
      } // 更新值后，批量更新最后会走到run
      // 如果是watch，那么this.value是老值，this.get()是新值

    }, {
      key: "run",
      value: function run() {
        // this.get()
        console.log('run');
        var newValue = this.get();
        var oldValue = this.value;
        this.value = newValue;

        if (this.user) {
          // 如果是用户watcher, 监听watch
          this.cb.call(this.vm, newValue, oldValue);
        }
      }
    }, {
      key: "update",
      value: function update() {
        console.log('update', this); // this.run()

        if (this.lazy) {
          // 是计算属性
          this.dirty = true;
        } else {
          queueWatcher(this);
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false; // 变化后更新状态，表示已经是最新的 无"杂质"
      }
    }, {
      key: "depend",
      value: function depend() {
        // 计算属性watcher 会存储 dep  dep会存储watcher
        // 通过watcher找到对应的所有dep，让所有的dep 都记住这个渲染watcher
        var i = this.deps.length;

        while (i--) {
          this.deps[i].depend(); // 让dep去存储渲染watcher
        }
      }
    }]);

    return Watcher;
  }();

  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.watch) {
      initWatch(vm);
    }

    if (opts.computed) {
      initComputed(vm);
    }
  }

  function initData(vm) {
    // 数据初始化
    var data = vm.$options.data;
    vm._data = data = typeof data === 'function' ? data.call(vm) : data;

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe$1(data);
  }

  function initWatch(vm) {
    var watch = vm.$options.watch;

    var _loop = function _loop(key) {
      var handler = watch[key]; // handler可能是 

      if (Array.isArray(handler)) {
        // 数组 、
        handler.forEach(function (handle) {
          createWatcher(vm, key, handle);
        });
      } else {
        createWatcher(vm, key, handler); // 字符串 、 对象 、 函数
      }
    };

    for (var key in watch) {
      _loop(key);
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


  function createWatcher(vm, exprOrFn, handler, options) {
    if (_typeof(handler) == 'object') {
      options = handler;
      handler = handler.handler; // 是一个函数
    }

    if (typeof handler == 'string') {
      // methods的情况
      handler = vm[handler]; // 将实例的方法作为handler
    } // key handler 用户传入的选项


    return vm.$watch(exprOrFn, handler, options);
  }

  function stateMixin(Vue) {
    Vue.prototype.$nextTick = function (cb) {
      nextTick(cb);
    };

    Vue.prototype.$watch = function (exprOrFn, cb) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      console.log('$watch', this); // 数据应该依赖这个watcher  数据变化后应该让watcher从新执行

      var watcher = new Watcher(this, exprOrFn, cb, _objectSpread2(_objectSpread2({}, options), {}, {
        user: true
      }));

      if (options.immediate) {
        cb(); // 如果是immdiate应该立刻执行
      }
    };
  }

  function initComputed(vm) {
    var computed = vm.$options.computed;
    var watchers = vm._computedWathcers = {}; // computed的watcher

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      watchers[key] = new Watcher(vm, getter, function () {}, {
        lazy: true
      });
      defineComputed(vm, key, userDef); // defineReactive()
    }
  }

  function defineComputed(vm, key, userDef) {
    var definition = {
      enumerable: true,
      // 是否可枚举
      configurable: true,
      get: function get() {},
      set: function set() {}
    };

    if (typeof userDef == 'function') {
      definition.get = createComputedGetter(key);
    } else {
      definition.get = createComputedGetter(key);
      definition.set = userDef.set;
    }

    Object.defineProperty(vm, key, definition);
    console.log(vm);
  }

  function createComputedGetter(key) {
    return function () {
      var watcher = this._computedWathcers[key];

      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate(); // 对当前watcher求值
        }

        if (Dep.target) {
          // 说明还有渲染watcher，也应该一并的收集起来
          watcher.depend();
        }

        return watcher.value; // 默认返回watcher上存的值
      }
    };
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名
  // ?:匹配不捕获

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // </my:xx>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的    aaa="aaa"  a='aaa'   a=aaa

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >    >   <div></div>  <br/>

  function parseHTML(html) {
    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        // 标签名
        type: 1,
        // 元素类型
        children: [],
        // 孩子列表
        attrs: attrs,
        // 属性集合
        parent: null // 父元素

      };
    }

    var root;
    var currentParent;
    var stack = [];

    function start(tagName, attrs) {
      // 创建一个元素 作为根元素
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; // 当前解析的标签 保存起来

      stack.push(element); // 将生产的ast元素放到栈中
    } // <div> <p></p> hello</div>    currentParent=p


    function end(tagName) {
      // 在结尾标签处 创建父子关系
      var element = stack.pop(); // 取出栈中的最后一个

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        // 在闭合时可以知道这个标签的父亲是谁
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function chars(text) {
      text = text.trim();

      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }

    while (html) {
      // 只要html不为空字符串就一直解析
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        // 肯定是标签
        var startTagMatch = parseStartTag(); // 开始标签匹配的结果 处理开始

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          // 处理结束标签
          advance(endTagMatch[0].length);
          end(endTagMatch[1]); // 将结束标签传入

          continue;
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        // 是处理文本
        text = html.substring(0, textEnd);
      }

      if (text) {
        // 处理文本
        advance(text.length);
        chars(text);
      }
    }

    function advance(n) {
      // 将字符串进行截取操作 在更新html内容
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // 删除开始标签
        // 如果直接是闭合标签了 说明没有属性

        var _end, attr; // 不是结尾标签 能匹配到属性


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length); // 去掉当前属性
        }

        if (_end) {
          // >  删除匹配到的结束标签
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  // 编写<div id="app" style="color:red"> hello {{name}} <span>hello</span></div>
  // 结果:render(){
  //    return _c('div',{id:'app',style:{color:'red'}},_v('hello'+_s(name)),_c('span',null,_v('hello')))
  //}
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //  语法层面的转义

  function genProps(attrs) {
    //  id   "app"     / style  "fontSize:12px;color:red"
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {}; // 对样式进行特殊的处理

          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function gen(node) {
    if (node.type == 1) {
      return generate(node); // 生产元素节点的字符串
    } else {
      var text = node.text; // 获取文本
      // 如果是普通文本 不带{{}}

      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")"); // _v('hello {{ name }} world {{msg}} aa')   => _v('hello'+_s(name) +'world' + _s(msg))
      }

      var tokens = []; // 存放每一段的代码

      var lastIndex = defaultTagRE.lastIndex = 0; // 如果正则是全局模式 需要每次使用前置为0

      var match, index; // 每次匹配到的结果

      while (match = defaultTagRE.exec(text)) {
        index = match.index; // 保存匹配到的索引

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genChildren(el) {
    var children = el.children;

    if (children) {
      // 将所有转化后的儿子用逗号拼接起来
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }

  function generate(el) {
    var children = genChildren(el); // 儿子的生成

    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToFunctions(template) {
    // return template
    // 1. 将template转成ast树， 这样做的目的是，用js对象更方便后续操作
    var ast = parseHTML(template);
    /* console.log(ast)
      {
        attrs: (2) [{…}, {…}]
        children: (3) [{…}, {…}, {…}]
        parent: null
        tag: "div"
        type: 1
      }
    */
    // 2. 优化静态节点
    // 3. 用ast生成code, 主要是用vue的的方法去包装成code，
    // 这样在render函数执行时，会用vue原型上的方法去编译render函数

    var code = generate(ast); // _c('div',{id:"app",style:{"color":"red"}},_c('p',undefined,_v("hello world zf")),_c('li',undefined,_v(_s(school.name))),_c('li',undefined,_v(_s(school.age))))
    // console.log(code);
    // 4. 通过new Function + with的方式，生成render函数

    var render = new Function("with(this){return ".concat(code, "}"));
    /*
      with 的用法
      https://blog.csdn.net/zwkkkk1/article/details/79725934
    */

    return render;
  }

  function patch(oldVnode, vnode) {
    // oldVnode => id#app   vnode 我们根据模板产生的虚拟dom
    // 将虚拟节点转化成真实节点
    if (oldVnode.nodeType === 1) {
      var el = createElm(vnode); // 产生真实的dom 

      var parentElm = oldVnode.parentNode; // 获取老的app的父亲 =》 body

      parentElm.insertBefore(el, oldVnode.nextSibling); // 当前的真实元素插入到app的后面

      parentElm.removeChild(oldVnode); // 删除老的节点

      return el;
    } else {
      // 在更新的时 拿老的虚拟节点 和 新的虚拟节点做对比 ，将不同的地方更新真实的dom
      // 更新功能
      // 那当前节点 整个
      // 1.比较两个元素的标签 ，标签不一样直接替换掉即可 parentNode.replaceChild(newel, oldel)
      if (oldVnode.tag !== vnode.tag) {
        return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
      } // 剩下的是标签一样的
      // 2.有种可能是标签一样 <div>1</div>   <div>2</div>
      //  文本节点的虚拟节点tag 都是undefined 文本替换用 DOMElemnt.textContent = newVal


      if (!oldVnode.tag) {
        if (oldVnode.text !== vnode.text) {
          return oldVnode.el.textContent = vnode.text;
        }
      } // 3.其他情况 开始比对标签的属性 和 儿子了
      // 可以复用老节点了，el是一个DOMElement对象，只改变el里属性或者孩子即可
      // 所以可以把老vnode的el赋值给新vnode


      var _el = vnode.el = oldVnode.el; // 3.1 更新属性，用新的虚拟节点的属性和老的比较，去更新节点
      // 新老属性做对比


      updateProperties(vnode, oldVnode.data); // 比较孩子

      var oldChildren = oldVnode.children || [];
      var newChildren = vnode.children || [];

      if (oldChildren.length > 0 && newChildren.length > 0) {
        // 老的有儿子 新的也有儿子  diff 算法
        updateChildren(oldChildren, newChildren, _el);
      } else if (oldChildren.length > 0) {
        // 新的没有
        _el.innerHTML = '';
      } else if (newChildren.length > 0) {
        // 老的没有
        for (var i = 0; i < newChildren.length; i++) {
          var child = newChildren[i]; // 浏览器有性能优化 不用自己在搞文档碎片了

          _el.appendChild(createElm(child));
        }
      }

      return _el;
    }
  }

  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag == newVnode.tag && oldVnode.key == newVnode.key;
  } // 儿子间的比较


  function updateChildren(oldChildren, newChildren, parent) {
    // 开头指针
    var oldStartIndex = 0; // 老的索引

    var oldStartVnode = oldChildren[0]; // 老的索引指向的节点

    var oldEndIndex = oldChildren.length - 1;
    var oldEndVnode = oldChildren[oldEndIndex];
    var newStartIndex = 0; // 老的索引

    var newStartVnode = newChildren[0]; // 老的索引指向的节点

    var newEndIndex = newChildren.length - 1;
    var newEndVnode = newChildren[newEndIndex]; // vue 中的diff算做了很多了优化
    // DOM中操作有很多常见的逻辑 把节点插入到当前儿子的头部、尾部、儿子倒叙正序
    // vue2中采用的是双指针的方式
    // 在尾部添加
    // 我要做一个循环，同时循环老的和新的，哪个先结束 循环就停止，将多余的删除或者添加进去
    // 比较谁先循环停止  || 一个true就继续  && 俩都得true

    function makeIndexByKey(children) {
      var map = {};
      children.forEach(function (item, index) {
        if (item.key) {
          map[item.key] = index; // {A0,B:1,c:2,d:3}
        }
      });
      return map;
    }

    var map = makeIndexByKey(oldChildren);

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (!oldStartVnode) {
        // 指针指向了null 跳过这次的处理
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex];
      } else if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 如果俩人是同一个元素，比对儿子 
        patch(oldStartVnode, newStartVnode); // 更新属性和再去递归更新子节点

        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        // 老的尾部和新的头部比较
        patch(oldStartVnode, newEndVnode); // 将当前元素插入到尾部的 下一个元素的前面

        parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        patch(oldEndVnode, newStartVnode);
        parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex]; // 为什么要有key，循环的时候为什么不能用index作为key
      } else {
        // 儿子之间没关系 ..... 暴力比对
        var moveIndex = map[newStartVnode.key]; // 拿到开头的虚拟节点的key 去老的中找

        if (moveIndex == undefined) {
          // 不需要移动说明没有key复用的
          parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          var moveVNode = oldChildren[moveIndex]; // 这个老的虚拟节点需要移动

          patch(moveVNode, newStartVnode); // 比较属性和儿子

          parent.insertBefore(moveVNode.el, oldStartVnode.el); // 移动功能,dom映射

          oldChildren[moveIndex] = null;
        }

        newStartVnode = newChildren[++newStartIndex]; // 用新的不停的去老的里面找
      } // 反转节点， 头部移动尾部 尾部移动到头部

    }

    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        // 将新的多余的插入进去即可 ,可能是向前添加 还有可能是向后添加
        // parent.appendChild(createElm(newChildren[i]));
        // 向后插入 ele = null
        // 像前插入 ele 就是当前像谁前面插入
        var ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
        parent.insertBefore(createElm(newChildren[i]), ele);
      }
    } // 老的节点还有没处理的，说明这些老节点是不需要的节点，如过这里面有null说明，这个节点已经被处理过了，跳过即可


    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        var child = oldChildren[_i];

        if (child != null) {
          parent.removeChild(child.el);
        }
      }
    }
  }

  function createComponent(vnode) {
    // 调用hook中init方法 
    var i = vnode.data;

    if ((i = i.hook) && (i = i.init)) {
      // i就是init方法
      i(vnode); // 内部会去new 组件 会将实例挂载在vnode上
    }

    if (vnode.componentInstance) {
      // 如果是组件返回true
      return true;
    }
  }
  /**
   * tag,children,key,data,text vnode上的几个属性
   * @param {Object} vnode 虚拟节点
   */


  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text;

    if (typeof tag == 'string') {
      // 创建元素 放到vnode.el上
      if (createComponent(vnode)) {
        // 组件渲染后的结果 放到当前组件的实例上 vm.$el
        return vnode.componentInstance.$el; // 组件对应的dom元素
      }

      vnode.el = document.createElement(tag); // 只有元素才有属性

      updateProperties(vnode);
      children && children.forEach(function (child) {
        // 遍历儿子 将儿子渲染后的结果扔到父亲中
        vnode.el.appendChild(createElm(child));
      });
    } else {
      // 创建文件 放到vnode.el上
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  } // vue 的渲染流程 =》 先初始化数据 =》 将模板进行编译 =》 render函数 =》 生成虚拟节点 =》 生成真实的dom  =》 扔到页面上

  /**
   * 
   * @param {*} vnode 
   * @param {*} oldProps 旧节点的属性对象 oldVnode.data
   */

  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {};
    var el = vnode.el; // 1. 老得有，新的没有 删掉老得 DOMElement.removeAttribute()

    for (var key in oldProps) {
      if (!newProps[key]) {
        el.removeAttribute(key);
      }
    } // 2. 比对样式


    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {}; // 老的样式中有 新的没有 删除老的样式

    for (var _key in oldStyle) {
      if (!newStyle[_key]) {
        el.style[_key] = '';
      }
    } // 2. 老得没有，新的有 那就直接用新的去做更新即可


    for (var _key2 in newProps) {
      if (_key2 == 'style') {
        // {color:red}
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key2 == 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function lifeCycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this; // 用新的创建的元素 替换老的vm.$el

      vm.$el = patch(vm.$el, vnode);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el; // 调用render方法去渲染 el属性
    // 先调用render方法创建虚拟节点，在将虚拟节点渲染到页面上

    callHook(vm, 'beforeMount');

    var updateComponent = function updateComponent() {
      vm._update(vm._render()); // 渲染 、 更新

    }; // 这个watcher是用于渲染的 目前没有任何功能  updateComponent()
    // 初始化就会创建watcher


    var watcher = new Watcher(vm, updateComponent, function () {
      callHook(vm, 'updated');
    }, true); // 渲染watcher 只是个名字
    // 要把属性 和 watcher绑定在一起 

    callHook(vm, 'mounted');
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 实例
      // 要把全局的合并一起

      vm.$options = mergeOptions(vm.constructor.options, options); // 属性挂在实例的$options

      callHook(vm, 'beforeCreate');
      initState(vm);
      callHook(vm, 'created');

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);

      if (!options.render) {
        // 没render 将template转化成render方法
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        } // 编译原理 将模板编译成render函数


        var render = compileToFunctions(template);
        options.render = render;
      } // 都解析成render函数之后，挂载组件


      mountComponent(vm, el);
    };
  }

  function renderMixin(Vue) {
    // 用对象来描述dom的解构
    Vue.prototype._c = function () {
      // 创建虚拟dom元素
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    }; // 1.当结果是对象时 会对这个对象取值


    Vue.prototype._s = function (val) {
      // stringify
      return val == null ? '' : _typeof(val) == 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._v = function (text) {
      // 创建虚拟dom文本元素
      return createTextVnode(text);
    };

    Vue.prototype._render = function () {
      // _render = render
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      return vnode;
    };
  } // _c('div',{},_v(),_c())

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (isReservedTag(tag)) {
      return vnode(tag, data, data.key, children);
    } // 如果是组件，产生虚拟节点时需要把组件的构造函数传入, new VueCompnent().$mount


    var Ctor = vm.$options.components[tag];
    return createCompnent(vm, tag, data, data.key, children, Ctor);
  }

  function createCompnent(vm, tag, data, key, children, Ctor) {
    // 组件的children是chachao
    var baseCtor = vm.$options._base; // Vue构造器
    // Ctor可能是对象，也可能是构造函数

    if (_typeof(Ctor) === 'object') {
      Ctor = baseCtor.extend(Ctor); // 返回一个Vuecomponet构造函数（继承Vue构造函数）
    } // 给组件增加生命周期


    data.hook = {
      // 稍后初始化，会调用init
      init: function init() {}
    };
    return vnode("vue-compnent-".concat(Ctor.cid, "-").concat(tag), data, key, undefined, undefined);
  }

  function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  } // 用来产生虚拟dom的,操作真实dom浪费性能


  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function initExtend(Vue) {
    var cid = 0; // 核心就是创造一个子类继承我们的父类

    Vue.extend = function (extendOptions) {
      // 如果对象相同 应该复用构造函数 （缓存）
      var Super = this;

      var Sub = function VueComponent(options) {
        this._init(options);
      };

      Sub.cid = cid++; // 子类要继承父类原型上的方法, 原型继承

      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub; // 处理其他的属性 mixin component ....

      Sub.options = mergeOptions(Super.options, extendOptions);
      Sub.components = Super.components; // ....    

      return Sub;
    };
  } // 组件的渲染流程
  // 1.调用Vue.component
  // 2.内部用的是Vue.extend 就是产生一个子类来继承父类 
  // 3.等会创建子类实例时会调用父类的_init方法，在$mount即可
  // 4.组件的初始化就是 new 这个组件的构造函数并且调用$mount方法
  // 5.创建虚拟节点 根据标签晒出组件对应，生成组件的虚拟节点 componentOptions里面包含Ctor,children 
  // 6.组件创建真实dom时 （先渲染的是父组件） 遇到是组件的虚拟节点时，去调用init方法，让组件初始化并挂载， 组件的$mount无参数会把渲染后的dom放到 vm.$el上 =》 vnode.componentInstance中,这样渲染时就 获取这个对象的$el属性来渲染

  function initGlobalApi(Vue) {
    Vue.options = {}; // 要将mixin合并到去全局配置中

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    };
    /*
     Vue.component('my-button', {
      name: 'my-button',
      template:'<button>{{a}}</button>',
      created(){
        console.log('child created')
      },
      ...
     })
     */


    Vue.options._base = Vue;
    Vue.options.components = {};
    initExtend(Vue); // initAssetRegisters....  directive filter

    Vue.component = function (id, definition) {
      // Vue.extend 
      definition.name = definition.name || id; // 默认会以name属性为准
      // 根据当前组件对象 生成了一个子类的构造函数
      // 用的时候得 new definition().$mount()

      definition = this.options._base.extend(definition); // 永远是父类
      // Vue.component 注册组件 等价于  Vue.options.components[id] = definition

      Vue.options.components[id] = definition;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initGlobalApi(Vue);
  initMixin(Vue);
  lifeCycleMixin(Vue);
  renderMixin(Vue);
  stateMixin(Vue); // 初始化方法

  return Vue;

})));
//# sourceMappingURL=vue.js.map
