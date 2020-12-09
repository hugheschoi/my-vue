export function proxy (vm, data, key) {

  Object.defineProperty(vm, key, {
    get () {
      return vm[data][key]
    },
    set (val) {
      vm[data][key] = val
    }
  })
}

export function defineProperty (target, key, value) {
  Object.defineProperty(target, key, {
    enumerable: false,
    configurable: false,
    value
  })
}
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]
const strats = {}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

function mergeHook (parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  }
}

export function mergeOptions (parent, child) {
  const options = {}
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key])
    } else {
      options[key] = child[key]
    }
  }
  return options
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach(handler => {
      handler.call(vm)
    })
  }
}