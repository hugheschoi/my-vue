import { initMixin } from "./init.js"
import { renderMixin } from "./vdom/index";
import { lifeCycleMixin } from "./lifecycle.js";
import { initGlobalApi } from "./global-api/index.js";
import { stateMixin } from "./state.js";

function Vue (options) {
  this._init(options)
}
initGlobalApi(Vue)
initMixin(Vue)
lifeCycleMixin(Vue)
renderMixin(Vue)
stateMixin(Vue)

// 初始化方法

// 为了看到diff的整个流程 创建两个虚拟节点来进行比对操作
import {compileToFunctions} from './compiler/index';
import {createElm,patch} from './vdom/patch'
let vm1 = new Vue({data:{name:'zf'}});
/**
 * <li style="background:red" key="A">A</li> 
 * <li style="background:yellow" key="B">B</li>
   <li style="background:pink" key="C">C</li>
   <li style="background:green" key="D">D</li>
   <li style="background:green" key="F">F</li>
 */
let render1 = compileToFunctions(`<div class="a" style="color:red">{{name}}
</div>`);
let vnode1 = render1.call(vm1); // render方法返回的是虚拟dom

document.body.appendChild(createElm(vnode1))

let vm2 = new Vue({data:{name:'jw'}});
/**
 * <li style="background:red" key="Z">Z</li>
   <li style="background:green" key="M">M</li>
   <li style="background:pink" key="B">B</li>
   <li style="background:yellow" key="A">A</li>
   <li style="background:red" key="Q">Q</li>
 */
let render2 = compileToFunctions(`<div class="a" style="color:green">
{{name}}
</div>`);
let vnode2 = render2.call(vm2); // render方法返回的是虚拟dom

// 用新的虚拟节点对比老的虚拟节点，找到差异 去更新老的dom元素


setTimeout(() => {
   patch(vnode1,vnode2); // 传入新的虚拟节点和老的 做一个对比
}, 3000);

export default Vue