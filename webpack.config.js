/*
* @Author: daihanqiao
* @Date:   2015-12-08 19:59:14
* @Last Modified by:   daihanqiao
* @Last Modified time: 2015-12-23 13:35:16
* webpack配置文件
*/
//根据环境变量配置输出目录
var webpack = require('webpack');
var fs = require('fs');
var path = require('path');
//生成绝对路径
var getPath = function(url) {
    return path.resolve(__dirname, url);
};
var isRelease = (process.env.NODE_ENV == 'release');
var outputDir = isRelease ? 'release' : 'dev';
//发布版做相应设置
if(isRelease){
    //删除release目录
    if(fs.existsSync(getPath(outputDir))){
        var exec = require('child_process').exec;
        var child_process = exec('rm -rf '+ outputDir,function(err,out) {
            console.log(out); err && console.log(err);
        });
    }
}
//复制连接两个obj
function copyObj(fromObj,toObj){
    for (var attr in fromObj) {
        if (fromObj.hasOwnProperty(attr)){
            if(toObj[attr]){
                throw "出现重名文件：" + toObj[attr];
            }
            toObj[attr] = fromObj[attr];
        }
    }
}
//根据fileType获取文件别名列表和不带后缀的文件名列表
function getFileList(path){
    var fileAliasList = {};//文件别名{'alis':fullPath}
    var entryAliasList = {};//入口程序别名
    var entryNameList = [];//入口程序文件名
    walk = function(path, fileAliasList,entryAliasList,entryNameList){
        files = fs.readdirSync(path);
        files.forEach(function(item) {
            var tmpPath = path + '/' + item;
            var stats = fs.statSync(tmpPath);
            if (stats.isDirectory()) {
                walk(tmpPath, fileAliasList,entryAliasList,entryNameList);
            } else {
                var fileType = tmpPath.split('.').pop();
                var fileName =tmpPath.split('/').pop().replace(/\.\w+$/,'');
                if(fileType == 'html'){
                    return false;
                }
                //入口程序js
                if(fileType == 'js' && fileName.indexOf('.entry') != -1){
                    entryAliasList[fileName] = getPath(tmpPath);
                    entryNameList.push(fileName);
                }else{
                    fileType == 'css' && (fileName = fileName + 'Css');
                    fileAliasList[fileName] = getPath(tmpPath);
                }
            }
        });
    };
    walk(path, fileAliasList,entryAliasList,entryNameList);
    return {
            'aliasList':fileAliasList,
            'entryAliasList':entryAliasList,
            'entryNameList':entryNameList
        };
}
//所有components资源别名
var aliasList = getFileList(getPath('src/components')).aliasList;
//所有page目录下文件列表
var pageFileList = getFileList(getPath('src/page'));
//所有page除入口程序以外的资源别名
var pageAliasList = pageFileList.aliasList;
//将所有资源别名合并到aliasList
copyObj(pageAliasList,aliasList);
//入口文件配置
var entryAliasList = pageFileList.entryAliasList;
var entryNameList = pageFileList.entryNameList;
console.log('----------------------------------------------');
console.log("entryAlias:" , entryAliasList);
console.log('----------------------------------------------');
console.log("entryName:" , entryNameList);
console.log('----------------------------------------------');
console.log('alias:' , aliasList);
console.log('----------------------------------------------');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var outputName = isRelease ? 'js/[name].[hash:8].js' :'js/[name].js';
var extractTextName = isRelease ? 'css/[name].[hash:8].css' : 'css/[name].css';

var plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        'name':'../lib/common',      //输出公共库文件名
        'minChunks':3,              //最少被3个入口文件引入的js文件会打包进common
        'minSize':1024              //打包进common的文件最小尺寸，单位：字节
    },entryNameList),
    //不采用style的方式加入css
    new ExtractTextPlugin(extractTextName,{allChunks:false,disable:false}),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({      //该插件可以增加公共配置
        __DEBUG__:true,
    }),
    // new webpack.ProvidePlugin({     //开启后js文件中不需要手动require:react,react-dom
    //     React: 'react',
    //     ReactDOM: 'react-dom',
    // }),
];

//webpack配置
module.exports = {
    //页面入口文件配置
    entry: entryAliasList,
    //入口文件输出配置
    output: {
        path: getPath(outputDir),
        publicPath: 'http://react.contacts.com/'+outputDir+'/',//文件公共路径
        filename: outputName
    },
    module: {
        //加载器配置
        loaders: [
            {test:/\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            { test: /\.js$/, loader: 'jsx-loader?harmony' },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
        ],
        noParse: [] //不解析某文件，例如压缩后的react.min.js，和输出无关
    },
    // devtool: "source-map",
    //插件项
    plugins: plugins,
    //其它解决方案配置
    resolve: {
        // root: './', //绝对路径
        extensions: ['', '.js', '.json', '.scss', '.css'],
        alias: aliasList
    }
};