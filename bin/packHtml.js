/*
* @Author: {daihanqiao}
* @Date:   2015-12-15 10:09:36
* @Last Modified by:   {daihanqiao}
* @Last Modified time: 2015-12-15 12:56:06
* 打包html,并插入公共js,css以及页面js,css文件引入
*/

var fs = require('fs');
var path = require('path');
//生成绝对路径
var getPath = function(url) {
    return path.resolve('./', url);
};
var outputDir = process.env.NODE_ENV == 'release' ? 'release' : 'dev';
//生成目录
function mkdirSync(path){
    if(!fs.existsSync(getPath(path))){
        fs.mkdirSync(getPath(path));
    }
}
//在指定字符串前插入字符串
function insStrBeforeIndex(oldStr,specifyStr,insStr,fileName){
	var arr = oldStr.split(specifyStr);
	if(arr.length != 2){
		throw fileName + ".html Don't have Num:" + arr.length + " " + specifyStr + " !";
	}
	arr[0] = arr[0] + insStr;
	// console.log(arr);
	var newStr = arr.join(specifyStr);
	return newStr;
}
//生成输出目录和输出目录下html目录
mkdirSync(getPath(outputDir));
mkdirSync(getPath(outputDir + '/html/'));
//输出目录下所有js,css文件列表
function getFileList(path){
    var fileNameList = [];//不带后缀文件名
    walk = function(path, fileNameList){
        files = fs.readdirSync(path);
        files.forEach(function(item) {
            var tmpPath = path + '/' + item;
            var stats = fs.statSync(tmpPath);
            if (stats.isDirectory()) {
                walk(tmpPath,fileNameList);
            } else {
                var fileName =tmpPath.split('/').pop();
                fileNameList.push(fileName);
            }
        });
    };
    walk(path,fileNameList);
    return fileNameList;
}
var fileNameList = getFileList(getPath(outputDir));
console.log(fileNameList);
var fileListLen = fileNameList.length;
//根据原始文件名获取带Hash的文件名。null为找不到该文件
function checkFileName(fileName,fileType){
	for(var i = 0;i<fileListLen;i++){
		if(fileNameList[i].indexOf(fileName) != -1 && fileNameList[i].indexOf(fileType) != -1){
			console.log(fileNameList[i]);
			return fileNameList[i];
		}
	}
	return null;
}
function genHtmlFiles(path){
    walk = function(path){
        files = fs.readdirSync(path);
        files.forEach(function(item) {
            var tmpPath = path + '/' + item;
            var stats = fs.statSync(tmpPath);
            if (stats.isDirectory()) {
                walk(tmpPath);
            } else {
                var fileType = tmpPath.split('.').pop();
                var fileName =tmpPath.split('/').pop().replace(/\.\w+$/,'');
                if(fileType != 'html'){
                    return false;
                }
                var data=fs.readFileSync(tmpPath,"utf-8");
                //检测是否已引入页面js,css和公共js,css
                if(data.indexOf('/' + fileName + '.entry.js') != -1){
                	throw fileName + ".html Don't need to introduce "+ fileName + '.entry.js !';
                }
                if(data.indexOf('/' + fileName + '.entry.js') != -1){
                	throw fileName + ".html Don't need to introduce "+ fileName + '.entry.css !';
                }
                if(data.indexOf('/common.js') != -1){
                	throw fileName + ".html Don't need to introduce common.js !";
                }
                if(data.indexOf('/common.css') != -1){
                	throw fileName + ".html Don't need to introduce common.css !";
                }
                //手动引入公共js,css,页面js,css
                var insStrCss = "";
                var commonCssPath = checkFileName('common','.css');
                if(commonCssPath){
                    insStrCss += '    <link rel="stylesheet" type="text/css" href="../lib/'+commonCssPath+'">\n    ';
                }
                var entryCssPath = checkFileName(fileName + '.entry','.css');
                if(entryCssPath){
                    insStrCss += '    <link rel="stylesheet" type="text/css" href="../css/'+entryCssPath+'">\n    ';
                }
                data = insStrBeforeIndex(data,'</head>',insStrCss,fileName);
                var insStrJs = "";
                var commonJsPath = checkFileName('common','.js');
                if(commonJsPath){
                    insStrJs += '    <script type="text/javascript" src="../lib/'+commonJsPath+'"></script>\n    ';
                }
                var entryJsPath = checkFileName(fileName + '.entry','.js');
                if(entryJsPath){
                    insStrJs += '    <script type="text/javascript" src="../js/'+entryJsPath+'"></script>\n    ';
                }
                data = insStrBeforeIndex(data,'</body>',insStrJs,fileName);
                var genHtmlPath = getPath(outputDir + '/html/'+fileName+'.html');
                fs.writeFile(genHtmlPath,data,function(err){
                    err && console.log(err);
                });
            }
        });
    };
    walk(path);
}
genHtmlFiles(getPath('src/page'));