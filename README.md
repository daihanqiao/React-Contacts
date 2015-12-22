1、环境配置：安装最新版本nodejs
			 全局安装: webpack:npm i -g webpack
			 本地安装: npm i webpack jsx-loader css-loader style-loader react react-dom extract-text-webpack-plugin --save-dev

2、新项目目录结构{
		bin:{packHtml.js},//webpack打包完成后输出html文件的脚本
		node_modules:{},//各npm安装的模块,
		src:{
			components:{
				fastclick:{fastclick.js},
				loader:{loader.js,loader.css}
				....
			},//各组件相关代码
			page:{
				index:{index.entry.js,index.html,index.css},//页面相关代码，页面入口js文件命名必须为***.entry.js
				....
			}
		},
		package.json,//项目相关配置，包括打包命令的配置。npm run dev , npm run release , npm run watch
		webpack.config.js,//webpack打包配置脚本
	}
3、输出目录结构，在原根目录下多出dev(release):{
		1.js:{1.js},//打包输出的按需加载模块
		css:{index.entry.css},//页面css
		js:{index.entry.js},//页面js
		lib:{common.js,common.css},//公共css,js
		html:{index.html},//页面html文件
	}
4、文件命名和目录结构必须按照规范，dev/release目录下所有文件均不可改动
5、page/下的html文件不需要引入common.js,common.css以及相应的页面js,css，packHtml.js会完成相关处理。
6、js,css文件的引入规则为：js直接require文件名，如：require('index');css需require文件名+Css，如：require('indexCss')
7、webpack中加了相关配置可在项目代码中直接调用，例如 __DEBUG__ && console.log("debug版本")。