/*
 * @Author: daihanqiao
 * @Date:   2015-12-05 22:39:04
 * @Last Modified by:   daihanqiao
 * @Last Modified time: 2016-01-07 15:52:16
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var AddGroup = require('addGroup');
var reqwest = require('reqwest');
var sha1 = require('js-sha1');
var Pubsub = require('pubsub-js');
var _ = {
    result :require('lodash/object/result'),
    find : require('lodash/collection/find'),
    map : require('lodash/collection/map'),
    remove : require('lodash/array/remove'),
    assign : require('lodash/object/assign'),
    now : require('lodash/date/now'),
};

var DepartmentList = require('departmentList');

require('bootstrap.minCss');
var Toast = require('toast');
var Loader = require('loader');
var ModalAlert = require('modalAlert');
require('indexCss');
var EVENT_CFG = require('indexEventCfg');

//将用户按部门分类
function setMemberData(memberList, departmentList) {
    var memberDepartmentList = {};
    for (var i = 0, len = memberList.length; i < len; i++) {
        var memberData = memberList[i];
        var member_department_id = memberData.member_department_id;
        if (!memberDepartmentList[member_department_id]) {
            memberDepartmentList[member_department_id] = [];
        }
        memberDepartmentList[member_department_id].push(memberData);
    }
    var list = [];
    for (i = 0, len = departmentList.length; i < len; i++) {
        var departmentData = departmentList[i];
        list.push({
            'department_name': departmentData.department_name,
            'id': departmentData.id,
            member_list: memberDepartmentList[departmentData.id] || []
        });
    }
    return list;
}

//ajax请求
var request = function(urlPath, succCallBack, param, method) {
    var now = _.now();
    var appKey = sha1("A6993663430779" + "UZ" + "99788B23-69C1-ECEA-DB4E-8186F7DBA764" + "UZ" + now) + "." + now;
    var needUpVersion = true;
    function ajax(urlPath, succCallBack, param, method){
        method = method || "GET";
        reqwest({
            url: "https://d.apicloud.com/mcm/api/" + urlPath + '?filter=' + encodeURIComponent(JSON.stringify({limit:500})),
            method: method,
            data: param,
            dataType: 'json',
            timeout: 30000,
            headers: {
                "X-APICloud-AppId": "A6993663430779",
                "X-APICloud-AppKey": appKey
            },
            success: function(ret) {
                succCallBack(ret);
                if(needUpVersion && method.toLowerCase() !== 'get'){
                    needUpVersion = false;
                    ajax('version',function(ret){
                        if(ret){
                            if(ret.length > 0){
                                var versionId = ret[0].id;
                                ajax('version/' + versionId, function(ret) {}, {update_time:_.now(),"_method": "PUT"}, 'post');
                            }else{
                                ajax('version',function(ret){},{
                                    "update_time": _.now(),
                                }, 'post');
                            }
                        }
                    });
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    }
    ajax(urlPath, succCallBack, param, method);
};
Loader.show();
request('department_class', function(ret) {
    var departmentList = ret;
    request('member', function(ret) {
        //只维护该数据，所有操作通过订阅者模式操作该数据，通过setState()刷新
        var memberDepartmentList = setMemberData(ret, departmentList);

        var departmentRender = ReactDOM.render(
            <DepartmentList></DepartmentList>, document.getElementById('departmentCon')
        );
        ReactDOM.render(
            <AddGroup ></AddGroup>, document.getElementById('addGroupCon')
        );
        render();
        Loader.hide();
        function render(){
            departmentRender.setState({departmentDataList:memberDepartmentList});
        }
        /***************************************处理数据操作********************************************/
        //删除分组
        Pubsub.subscribe(EVENT_CFG.delDepartmentEvent,function(evt,data){
            var msg = '你确定要删除<<'+data.department_name+'>>吗？(该分组下所有联系人均被删除)';
            ModalAlert.show({msg:msg,okCallBack:function(){
                //删除分组项
                request('department_class/' + data.id, function(ret) {
                    if (ret) {
                        //删除分组下联系人
                        var member_list = _.result(_.find(memberDepartmentList, {id:data.id}), 'member_list');
                        if(member_list && member_list.length > 0){
                            var requestList = [];
                            _.map(member_list,function(memberData){
                                requestList.push({"method": "DELETE","path": "/mcm/api/member/" + memberData.id});
                            });
                            request('batch', function(ret) {
                                //删除分组所有联系人回调
                            }, {requests: requestList}, 'post');
                        }
                        _.remove(memberDepartmentList,function(n){
                            return n.id === data.id;
                        });
                        render();
                    }
                }, {"_method": "DELETE"}, 'post');
            }});
        });
        //编辑分组
        Pubsub.subscribe(EVENT_CFG.editDepartmentEvent,function(evt,data){
            var msg = '请输入需要新的分组名：';
            ModalAlert.show({msg:msg,confirm:1,namePlaceholder:'分组名',okCallBack:function(nameValue){
                if(nameValue){
                    request('department_class/' + data.id, function(ret) {
                        if (ret) {
                            _.assign(_.find(memberDepartmentList,{id:data.id}), ret);
                            render();
                        }
                    }, {department_name:nameValue,"_method": "PUT"}, 'post');
                }else{
                    Toast.show('编辑失败，未输入新的分组名');
                }
            }});
        });
        //新增分组
        Pubsub.subscribe(EVENT_CFG.addDepartmentEvent,function(evt){
            var msg = '请输入需要新的分组名：';
            ModalAlert.show({msg:msg,confirm:1,namePlaceholder:'分组名',okCallBack:function(nameValue){
                if(nameValue){
                    request('department_class',function(ret){
                        ret.member_list = [];
                        memberDepartmentList.push(ret);
                        render();
                    },{'department_name':nameValue},'post');
                }else{
                    Toast.show('增加分组失败，未输入新的分组名');
                }
            }});
        });
        //新增联系人
        Pubsub.subscribe(EVENT_CFG.addMemberEvent,function(evt,data){
            var msg = '请输入联系人信息：';
            ModalAlert.show({msg:msg,confirm:2,namePlaceholder:'联系人姓名',mobilePlaceholder:'联系电话',okCallBack:function(nameValue,mobileValue){
                if(nameValue && mobileValue){
                    request('member', function(ret, err) {
                        if (ret) {
                            var member_list = _.result(_.find(memberDepartmentList, {id:data.id}), 'member_list');
                            member_list.push(ret);
                            render();
                        }
                    }, {
                        "member_name": nameValue,
                        "member_mobile": mobileValue,
                        'member_department_id':data.id
                    }, 'post');
                }else if(!nameValue){
                    Toast.show("增加联系人失败，未输入联系人姓名",3000);
                }else{
                    Toast.show("增加联系人失败，未输入联系电话",3000);
                }
            }});
        });
        //删除联系人
        Pubsub.subscribe(EVENT_CFG.delMemberEvent,function(evt,data){
            var msg = '你确定要删除'+data.member_name+'吗？';
            ModalAlert.show({msg:msg,okCallBack:function(){
                request('member/' + data.id, function(ret) {
                    if (ret) {
                        var member_list = _.result(_.find(memberDepartmentList, {id:data.member_department_id}), 'member_list');
                        _.remove(member_list,function(n){
                            return n.id === data.id;
                        });
                        render();
                    }
                }, {"_method": "DELETE"}, 'post');
            }});
        });
        //编辑联系人
        Pubsub.subscribe(EVENT_CFG.editMemberEvent,function(evt,data){
            if(data.member_name && data.member_mobile){
                request('member/' + data.id, function(ret, err) {
                    if(ret){
                        var member_list = _.result(_.find(memberDepartmentList, {id:data.member_department_id}), 'member_list');
                        _.assign(_.find(member_list,{id:data.id}), ret);
                        render();
                    }
                }, {"member_name": data.member_name,member_mobile: data.member_mobile,"_method": "PUT"}, 'post');
            }else if(!data.member_name){
                Toast.show("请输入联系人姓名",3000);
            }else{
                Toast.show("请输入联系电话",3000);
            }
        });
    });
});
