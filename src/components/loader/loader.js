/*
* @Author: daihanqiao
* @Date:   2015-12-05 23:12:33
* @Last Modified by:   daihanqiao
* @Last Modified time: 2015-12-19 14:09:55
*/
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
require("loaderCss");
//组件
var Loader = React.createClass({
	render: function() {
		return (
			<div>
				<div className='loader-bg'></div>
				<div className="loader-content">
				  <div className="loader-ball-scale-ripple-multiple">
				    <div></div>
				    <div></div>
				    <div></div>
				  </div>
				</div>
			</div>
		);
	}
});
//对外接口
var loaderLayer = null;
module.exports = {
	show:function(){
		if(!loaderLayer){
			loaderLayer = document.createElement('div');
			loaderLayer.style.zIndex = 10000;
			document.body.appendChild(loaderLayer);
		}
		ReactDOM.render(<Loader></Loader>,loaderLayer);
	},
	hide:function(){
		if(loaderLayer){
			ReactDOM.unmountComponentAtNode(loaderLayer);
		}
	}
}