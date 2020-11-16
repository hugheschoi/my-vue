import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
export default {
    input: './src/index.js',
    output: {
        format: 'umd', // 模块化类型 可以挂在window上
        file: 'dist/umd/vue.js', 
        name: 'Vue', // 打包后的全局变量的名字
        sourcemap: true // 映射表，方便调试
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        serve({ // 打开的浏览器 端口是3000端口
          port:3000,
          contentBase:'',
          openPage:'/public/index.html' // 打开页面是谁
        })
    ]
}