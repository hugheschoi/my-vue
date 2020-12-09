import { initMixin } from "./init.js"
import { renderMixin } from "./vdom/index";
import { lifeCycleMixin } from "./lifecycle.js";
import { initGlobalApi } from "./global-api/index.js";

function Vue (options) {
  this._init(options)
}
initGlobalApi(Vue)
initMixin(Vue)
lifeCycleMixin(Vue)
renderMixin(Vue)
export default Vue