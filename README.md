##项目简介
    react版通讯录,使用webpack打包。

##环境配置
* 安装最新版本nodejs
* 全局安装: webpack:npm i -g webpack
* 本地安装: npm i webpack jsx-loader css-loader style-loader react react-dom extract-text-webpack-plugin js-sha1 lodash pubsub-js react-bootstrap reqwest --save-dev

##项目目录结构
* `bin`: webpack打包完成后输出html文件的脚本
* `src`: 开发环境代码
    * `components`：公共组件
    * `page`：页面代码
* `package.json`：配置了运行命令`npm run dev` , `npm run release` , `npm run watch`

##输出目录结构(dev/release)
* `css`：页面css
* `js`:页面JS
* `lib`:公共css,js
* `html`:页面html文件

##备注
* `src/page`目录下的html文件不需要引入common.js,common.css以及相应的页面js,css，`packHtml.js`会完成相关处理
* js,css文件的引入规则为：js直接require文件名，如：`require('index')`;css需require文件名+Css，如：`require('indexCss')`
* webpack中加了相关配置可在项目代码中直接调用，例如 `__DEBUG__ && console.log("test")`
* 邮件(daihanqiao@126.com)
* QQ: 935483576

##关于作者
* 代汉桥