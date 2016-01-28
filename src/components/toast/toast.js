/*
* @Author: {daihanqiao}
* @Date:   2015-12-19 13:33:09
* @Last Modified by:   {daihanqiao}
* @Last Modified time: 2015-12-19 15:13:18
*/

'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
require("toastCss");
var toastLayer = null;
//组件
var Toast = React.createClass({
	propTypes:{
		msg:React.PropTypes.string.isRequired,
		time:React.PropTypes.number,
	},
	getDefaultProps:function(){
		return {time:2000};
	},
	componentDidMount:function(){
		if(toastLayer){
			var unmount = function(){
				ReactDOM.unmountComponentAtNode(toastLayer);
			};
			setTimeout(unmount,this.props.time);
		}
	},
	render: function() {
		return (
			<div className={'toast-container'}>{this.props.msg}</div>
		);
	}
});
//对外接口
module.exports = {
	show:function(msg,time){
		if(!toastLayer){
			toastLayer = document.createElement('div');
			toastLayer.style.zIndex = 20000;
			document.body.appendChild(toastLayer);
		}
		ReactDOM.render(<Toast msg={msg} time={time}></Toast>,toastLayer);
	}
};
