import { parseHTML } from "./parse";
import { generate } from "./generate";
export function compileToFunctions (template) {
  // return template
  // 1. 将template转成ast树， 这样做的目的是，用js对象更方便后续操作
  let ast = parseHTML(template)
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
  let code = generate(ast);
  // _c('div',{id:"app",style:{"color":"red"}},_c('p',undefined,_v("hello world zf")),_c('li',undefined,_v(_s(school.name))),_c('li',undefined,_v(_s(school.age))))
  // console.log(code);
  // 4. 通过new Function + with的方式，生成render函数
  let render = new Function(`with(this){return ${code}}`)
  /*
    with 的用法
    https://blog.csdn.net/zwkkkk1/article/details/79725934
  */
  return render
}
