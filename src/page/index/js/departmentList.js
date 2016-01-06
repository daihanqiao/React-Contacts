/*
* @Author: daihanqiao
* @Date:   2015-12-20 14:50:58
* @Last Modified by:   daihanqiao
* @Last Modified time: 2016-01-06 10:16:15
*/

'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var _ = {
    map : require('lodash/collection/map'),
};
var Pubsub = require('pubsub-js');
var EVENT_CFG = require('indexEventCfg');
var PanelGroup = require('react-bootstrap/lib/PanelGroup');
var Panel = require('react-bootstrap/lib/Panel');
var MemberList = require('memberList');

var DepartmentBtn = React.createClass({
	addHandler:function(){
		Pubsub.publish(EVENT_CFG.addMemberEvent,this.props.data);
	},
	editHandler:function(){
		Pubsub.publish(EVENT_CFG.editDepartmentEvent,this.props.data);
	},
	delHandler:function(){
		Pubsub.publish(EVENT_CFG.delDepartmentEvent,this.props.data);
	},
	render:function(){
		return 	<div>
					<a onClick={this.addHandler} className={"add btn btn-link"}>添加联系人</a>
					<a onClick={this.editHandler} className={"edit btn btn-link"}>编辑</a>
					<a onClick={this.delHandler} className={"close"} aria-label="Close"><span aria-hidden="true">&times;</span></a>
				</div>
	}
});
var DepartmentItem = React.createClass({
	componentDidMount:function(){
		var panelEl = ReactDOM.findDOMNode(this).parentNode.parentNode.parentNode;
		var departmentBtnCon = document.createElement('div');
		departmentBtnCon.classList.add('index-headButton');
		panelEl.appendChild(departmentBtnCon);
		ReactDOM.render(<DepartmentBtn data={this.props.data}></DepartmentBtn>,departmentBtnCon);
	},
	render:function(){
		return <MemberList memberDataList={this.props.data.member_list}></MemberList>
	}
});
module.exports = React.createClass({
	getInitialState: function() {
		return {
			departmentDataList: []
		};
	},
	render:function () {
		var departmentDataList = this.state.departmentDataList;
		var panelList = _.map(departmentDataList,function(data){
			return 	<Panel className={'index-memberItemGroup'} header={data.department_name} key={data.id} eventKey={data.id}>
						<DepartmentItem data={data}></DepartmentItem>
					</Panel>;
		});
		return <PanelGroup defaultActiveKey = "0" accordion>
			{panelList}
		</PanelGroup>
	}
});
