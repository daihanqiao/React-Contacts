/*
* @Author: {daihanqiao}
* @Date:   2015-12-15 14:53:46
* @Last Modified by:   {daihanqiao}
* @Last Modified time: 2015-12-21 17:00:19
*/

'use strict';
var React = require('react');
var Button = require('react-bootstrap/lib/Button');
var Pubsub = require('pubsub-js');
var EVENT_CFG = require('indexEventCfg');
module.exports = React.createClass({
	clickHandler:function(){
		Pubsub.publish(EVENT_CFG.addDepartmentEvent);
	},
	render:function(){
		return <Button onClick={this.clickHandler} bsStyle="info" bsSize="large" block>+ 增加分组 +</Button>;
	}
});
