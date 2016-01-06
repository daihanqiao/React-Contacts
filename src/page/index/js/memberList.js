/*
* @Author: daihanqiao
* @Date:   2015-12-20 14:54:25
* @Last Modified by:   daihanqiao
* @Last Modified time: 2016-01-06 10:12:22
*/

'use strict';
var React = require('react');
var _ = {
    map : require('lodash/collection/map'),
    isEqual : require('lodash/lang/isEqual'),
};

var Pubsub = require('pubsub-js');
var Button = require('react-bootstrap/lib/Button');
var Input = require('react-bootstrap/lib/Input');
var EVENT_CFG = require('indexEventCfg');
var MemberItem = React.createClass({
    propTypes:{
        memberData:React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            member_name: React.PropTypes.string.isRequired,
            member_mobile: React.PropTypes.string.isRequired,
        }),
    },
    getInitialState:function(){
        return {editing:false,editLabel:"编辑"};
    },
    componentWillReceiveProps:function(nextProps){
    	this.setState({editing:false,editLabel:"编辑"});
    },
    shouldComponentUpdate:function(nextProps,nextState){
    	return !(_.isEqual(nextState, this.state) && _.isEqual(nextProps, this.props));
    },
    delHandler:function(e) {
        var obj = {
        	id:this.props.memberData.id,
        	member_department_id:this.props.memberData.member_department_id,
        	member_name:this.props.memberData.member_name
        };
    	Pubsub.publish(EVENT_CFG.delMemberEvent,obj);
    },
    editHandler:function(e){
    	if(this.state.editing){
	        var obj = {
	        	id:this.props.memberData.id,
	        	member_department_id:this.props.memberData.member_department_id,
	        	member_name:this.refs.nameInput.getValue(),
	        	member_mobile:this.refs.mobileInput.getValue(),
	        };
	    	Pubsub.publish(EVENT_CFG.editMemberEvent,obj);
    	}else{
    		this.setState({editing:true,editLabel:'保存'})
    	}
    },
    render: function() {
        var labelCon;
        if(!this.state.editing){
            labelCon = <span>
                <span className = {'index-memberItemLabel'}>{this.props.memberData.member_name}</span>
                <span className = {'index-memberItemLabel'}>{this.props.memberData.member_mobile}</span>
            </span>
        }else{
            labelCon = <span>
                <Input ref="nameInput" type="text" placeholder="联系人姓名" bsStyle="success" />
                <Input ref="mobileInput" type="text" placeholder="联系电话" bsStyle="success" />
            </span>
        }
        return  <div className = {'index-memberItem'} >
                    {labelCon}
                    <Button onClick={this.delHandler} bsStyle = "danger">删除</Button>
                    <Button onClick={this.editHandler} bsStyle="success">{this.state.editLabel}</Button>
                </div>
    }
});
module.exports = React.createClass({
	render:function (argument) {
		var memberDataList = this.props.memberDataList;
		var itemList = _.map(memberDataList,function(data,index){
            return <MemberItem key={'memberItem_'+index} memberData={data}></MemberItem>;
		});
		return <div>{itemList}</div>
	}
});