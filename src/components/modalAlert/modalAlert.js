/*
* @Author: {daihanqiao}
* @Date:   2015-12-21 10:45:56
* @Last Modified by:   {daihanqiao}
* @Last Modified time: 2015-12-22 16:56:04
*/

'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Button = require('react-bootstrap/lib/Button');
var Modal = require('react-bootstrap/lib/Modal');
var Input = require('react-bootstrap/lib/Input');
require('modalAlertCss');

var initState = {show:false,msg:'',confirm:0};

//弹窗组件
var ModalAlert = React.createClass({
    okCallBack:function(){
        var nameInputValue = this.refs.nameInput ? this.refs.nameInput.getValue() : "";
        var mobileInputValue = this.refs.mobileInput ? this.refs.mobileInput.getValue() : "";
        this.state.okCallBack(nameInputValue,mobileInputValue);
        this.setState(initState);
    },
    cancelBack:function(){
        this.setState(initState);
    },
    getInitialState:function(){
        return initState;
    },
    render:function(){
        var input = null;
        if(this.state.confirm === 1){
            input = <Input ref="nameInput" type="text" placeholder={this.state.namePlaceholder} bsStyle="success" />;
        }else if(this.state.confirm === 2){
            input = <div>
                        <Input ref="nameInput" type="text" placeholder={this.state.namePlaceholder} bsStyle="success" />
                        <Input ref="mobileInput" type="text" placeholder={this.state.mobilePlaceholder} bsStyle="success" />
                    </div>;
        }
        return  <Modal show={this.state.show} onHide={this.cancelBack} aria-labelledby="contained-modal-title">
                    <Modal.Body>
                        {this.state.msg}
                        {input}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.okCallBack}>确 定</Button>
                        <Button onClick={this.cancelBack}>关 闭</Button>
                    </Modal.Footer>
                </Modal>;
    }
});

//对外接口
var modalAlertCon = null;
module.exports = {
	show:function(states){
		if(!modalAlertCon){
			modalAlertCon = document.createElement('div');
			modalAlertCon.style.zIndex = 1000;
			document.body.appendChild(modalAlertCon);
		}
        states.show = true;
		ReactDOM.render(<ModalAlert></ModalAlert>,modalAlertCon).setState(states);
	}
};
