import { initMixin } from "./init.js"
import { renderMixin } from "./vdom/index";
import { lifeCycleMixin } from "./lifecycle.js";

function Vue (options) {
  this._init(options)
}
initMixin(Vue)
lifeCycleMixin(Vue)
renderMixin(Vue)
export default Vue