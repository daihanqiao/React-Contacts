/*
* @Author: daihanqiao
* @Date:   2015-12-08 19:59:14
* @Last Modified by:   daihanqiao
* @Last Modified time: 2016-01-06 10:03:05
* webpack配置文件
*/
'use strict';
var webpack = require('webpack');
var fs = require('fs');
var walk = require('./bin/walk.js');
var path = require('path');
//生成绝对路径
var getPath = function(url) {
    return path.resolve(__dirname, url);
};
//根据环境变量配置输出目录
var isRelease = (process.env.NODE_ENV === 'release');
var outputDir = isRelease ? 'release' : 'dev';
//dev模式下当前打包目录，不传则默认全部打包
var curPageDir = JSON.parse(process.env.npm_config_argv).remain[0] || "";
//发布版做相应设置
if(isRelease){
    //删除release目录
    if(fs.existsSync(getPath(outputDir))){
        walk(getPath(outputDir),function(tmpPath){
            fs.unlinkSync(tmpPath);
        });
    }
}
//根据fileType获取文件别名列表和不带后缀的文件名列表
var aliasTypeList = ['js','css'];
//图片类型文件
var imageTypeList=["jpg","gif","jpeg","png",'bmp'];
function getFileList(path){
    var fileAliasList = {};//文件别名{'alis':fullPath}
    var entryAliasList = {};//入口程序别名
    var entryNameList = [];//入口程序文件名
    walk(path,function(tmpPath){
        var fileType = tmpPath.split('.').pop().toLowerCase();
        var fileName =tmpPath.split('/').pop().replace(/\.\w+$/,'');
        if(aliasTypeList.indexOf(fileType) === -1 && imageTypeList.indexOf(fileType) === -1){
            return false;
        }
        if(entryAliasList[fileName] || fileAliasList[fileName]){
            throw "出现重名文件：" + fileName;
        }
        //入口程序js
        if(fileType === 'js' && fileName.indexOf('.entry') !== -1){
            if(!curPageDir || fileName === curPageDir+'.entry'){
                entryAliasList[fileName] = getPath(tmpPath);
                entryNameList.push(fileName);
            }
        }else{
            fileType === 'css' && (fileName = fileName + 'Css');
            (imageTypeList.indexOf(fileType) !== -1) && (fileName = fileName + 'Img');
            fileAliasList[fileName] = getPath(tmpPath);
        }
    });
    return {
            'aliasList':fileAliasList,
            'entryAliasList':entryAliasList,
            'entryNameList':entryNameList
        };
}
//所有components资源别名
var aliasList = getFileList(getPath('src')).aliasList;
//所有page目录下文件列表
var pageFileList = getFileList(getPath('src/page'));
//入口文件配置
var entryAliasList = pageFileList.entryAliasList;
var entryNameList = pageFileList.entryNameList;
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var needHash = isRelease;
var outputName = needHash ? 'js/[name].[chunkhash:8].js' :'js/[name].js';
var extractTextName = needHash ? 'css/[name].[chunkhash:8].css' : 'css/[name].css';
var imageLoader = needHash ? 'url-loader?name=images/[name].[hash:8].[ext]&limit=8192' : 'url-loader?name=images/[name].[ext]&limit=8192';
var fontLoader = needHash ? 'url?name=fonts/[name].[hash:8].[ext]&prefix=font/&limit=10000' : 'url?name=fonts/[name].[ext]&prefix=font/&limit=10000';

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
if(isRelease){
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );
}

//webpack配置
module.exports = {
    //页面入口文件配置
    entry: entryAliasList,
    //入口文件输出配置
    output: {
        path: getPath(outputDir),
        publicPath: '../',//资源文件路径，包括字体，按需加载模块等
        filename: outputName
    },
    module: {
        //加载器配置
        loaders: [
            { test:/\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            { test: /\.js$/, loader: 'jsx-loader?harmony' },
            { test: /\.(png|jpg|gif)$/, loader: imageLoader},
            { test   : /\.woff|\.woff2|\.svg|.eot|.otf|\.ttf/, loader : fontLoader},
        ],
        noParse: [] //不解析某文件，例如压缩后的react.min.js，和输出无关
    },
    // devtool: "source-map",
    //插件项
    plugins: plugins,
    //其它解决方案配置
    resolve: {
        // root: './', //绝对路径
        extensions: ['', '.js', '.json', '.scss', '.css', "jpg"," gif", "jpeg", "png", 'bmp'],
        alias: aliasList
    }
};
