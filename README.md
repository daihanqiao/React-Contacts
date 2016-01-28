## 项目简介
    使用react实现的通讯录管理后台,使用webpack打包

## 项目详解
* 见[个人博客](http://daihanqiao.github.io/2016/01/14/Webpack—React最佳实践（一）/)

## 环境配置
* 安装最新版本nodejs
* 运行命令
```
npm i -g webpack
npm i webpack jsx-loader css-loader style-loader react react-dom extract-text-webpack-plugin js-sha1 lodash pubsub-js react-bootstrap url-loader file-loader reqwest --save-dev
```

## 项目目录结构
* `bin`: webpack打包过程中执行的相关脚本
* `src`: 开发环境代码
    * `base`：框架，配置等基础代码
    * `components`：组件代码
    * `page`：页面代码
* `package.json`：配置了运行命令`npm run dev` , `npm run release` , `npm run watch` , `npm run release-gzip`

## 输出目录结构(dev/release)
* `css`：页面css输出目录
* `js`:页面JS输出目录
* `lib`:公共css,js输出目录
* `html`:页面html文件输出目录
* `fonts`:字体相关文件输出目录
* `images`:图片图标相关文件输出目录

## Example
* 打开页面：`release/html/index.html`

## 约定
* 每个页面必须有且仅有一个其相应的入口程序js，html文件：例：index页面目录下必须包含`index.html`和`index.entry.js`
* 同类型的文件不可重名(所有格式图片算同一类型)
* html文件中无需引入任何js、css，bin目录下的脚本会处理html文件中js、css的依赖
* js文件的引入：`require('文件名')`
* css文件的引入：`require('文件名'+'Css')`
* 图片文件的引入：`require('文件名'+'Img')`

##关于作者
* 个人博客：http://daihanqiao.github.io/
* 邮件：`daihanqiao@126.com`
* QQ: `935483576`
