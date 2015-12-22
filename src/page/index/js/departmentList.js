/*
* @Author: daihanqiao
* @Date:   2015-12-20 14:50:58
* @Last Modified by:   daihanqiao
* @Last Modified time: 2015-12-21 17:39:20
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
var DepartmentItem = React.createClass({
	componentDidMount:function(){
		var self = this;
		var panelEl = ReactDOM.findDOMNode(self).parentNode.parentNode.parentNode;
		var panelBtn = '<div class="index-headButton">'+
			'<a class="add btn btn-link">添加联系人</a>' +
			'<a class="edit btn btn-link">编辑</a>' +
			'<a class="close" aria-label="Close"><span aria-hidden="true">&times;</span></a>'+
		'</div>';
		panelEl.insertAdjacentHTML('beforeend',panelBtn);
		panelEl.querySelector('.index-headButton .add').addEventListener('click',function(){
			self.addHandler();
		});
		panelEl.querySelector('.index-headButton .edit').addEventListener('click',function(){
			self.editHandler();
		});
		panelEl.querySelector('.index-headButton .close').addEventListener('click',function(){
			self.delHandler();
		});
	},
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
		return <MemberList memberDataList={this.props.data.member_list}></MemberList>
	}
});
module.exports = React.createClass({
	delHandler:function(e) {
	    var obj = {
	    	id:this.props.memberData.id,
	    	member_department_id:this.props.memberData.member_department_id,
	    	member_name:this.props.memberData.member_name
	    };
		Pubsub.publish(EVENT_CFG.delMemberEvent,obj);
	},
	render:function () {
		var departmentDataList = this.props.departmentDataList;
		var domList = [];
		_.map(departmentDataList,function(data){
			domList.push(<Panel className={'index-memberItemGroup'} header={data.department_name} key={data.id} eventKey={data.id}>
					<DepartmentItem data={data}></DepartmentItem>
				</Panel>);
		});
		return <PanelGroup defaultActiveKey = "0" accordion>
			{domList}
		</PanelGroup>
	}
});
