import React from 'react';
import {Container} from 'native-base';
import {Image, StyleSheet, Text, View} from 'react-native';
import BaseScreen from '../../../../base/BaseScreen';

import KBHeader from '../../../../components/KBHeader';
import KBButton from '../../../../components/KBButton';
import Search from '../../../../components/search/Search';
import TableView from '../../../../components/tableView/index';
import ItemModel from '../../../../components/tableView/ItemModel';
import Utils from '../../../../utils/Utils';
import theme from '../../../../constants/theme';
import image from '../../../../constants/image';
import colors from '../../../../constants/colors';
import fetchUrl from '../../../../constants/fetchUrl';

import GroupMemberHolder from './holder/GroupMemberHolder';
import GroupMembersAdapter from './holder/GroupMembersAdapter';
import ToastUtils from "../../../../utils/ToastUtils";
import HttpUtils from "../../../../utils/HttpUtils";
import {GROUP_UPDATE} from "../../../../constants/notify";


export default class GroupMembersScreen extends BaseScreen {
    constructor(props) {
        super(props);


        this.state = Object.assign({

            data: [],
            showData: [],
            isSelectAll: false,

        }, this.state);

        this.adapter = new GroupMembersAdapter();

        const {params} = this.props.navigation.state;
        const {goBack} = this.props.navigation;
        this.isNewGroup = params.isNewGroup;
        this.getGroupMember = params.getGroupMember;
        this.classId = params.classId;
        this.groupId = params.groupId;
        this.groupName = params.students[0]?.groupName;
        this.students = params.students;
        this.groupSort = params.students[0]?.groupSort;
        this.isEdit = params.isEdit;
        this.goBack = goBack;
    }

    getApiUrl() {
        return fetchUrl.getClassStudentList + '&classIds=' + this.classId;
    }

    onSuccess(responseData) {

        if (responseData.data && responseData.data.length > 0) {
            let data = [];
            if (this.isNewGroup) {
                for (let obj of responseData.data) {
                    if (Utils.isNull(obj.groupId)) {
                        if (this.students.length > 0) {
                            let student = this.students.find((student) => student.id === obj.id);
                            if (student) {
                                obj.isSelected = true;
                            } else {
                                obj.isSelected = false;
                            }
                        } else {
                            obj.isSelected = false;

                        }
                        data.push(obj);
                    }
                }

            } else {
                data = responseData.data;
                for (let obj of data) {
                    if (this.students.length > 0) {
                        let student = this.students.find((student) => student.id === obj.id);
                        if (student) {
                            obj.isSelected = true;
                        } else {
                            obj.isSelected = false;
                        }
                    } else {
                        obj.isSelected = false;

                    }
                }
            }

            this.setState({
                data: data,
                showData: data,
            });
        } else {
            this.setState({
                isNullData: true,
            });
        }
    }

    showData(data) {

        this.adapter.removeAll();

        let sortData = Utils.getSortData(data, 'groupId');
        let keys = Object.keys(sortData);

        for (let index = 0; index < keys.length; index++) {
            let array = sortData[keys[index]];
            let itemModel = new ItemModel(index, GroupMemberHolder);
            itemModel.setAttribute('data', array);
            itemModel.setAttribute('itemClick', this.itemClick);
            itemModel.setAttribute('world', this);

            let groupName = '';
            if (Utils.isNull(keys[index])) {
                groupName = '未分组';
            } else {
                if (keys[index] === this.groupId) {
                    groupName = '本小组';
                } else {
                    groupName = array[0].groupName;
                }
            }
            this.adapter.addItem(index, groupName, itemModel);
        }
    }

    renderData() {
        return (
            <View style={{
                backgroundColor: colors.white,
                flex: 1,
            }}>
                <View style={{height: 40}}>
                    <Search
                        backgroundColor={'#ffffff'}
                        placeholderTextColor={'#888'}
                        titleCancelColor={'#999999'}
                        inputHeight={30}
                        inputBorderRadius={15}
                        tintColorSearch={'#333333'}
                        blurOnSubmit={true}
                        ref="search_box"
                        onFocus={this.onFocus}
                        onCancel={this.onCancel}
                        onChangeText={this.onChangeText}
                        onSearch={this.onSearch}
                        cancelTitle={'取消'}
                        cancelButtonTextStyle={{fontSize: 13}}
                        placeholder={'搜索'}

                    />
                </View>

                <TableView
                    ref={(c) => this.tableView = c}
                    adapter={this.adapter}
                />
                {this.renderToolBarView()}
            </View>
        );
    }

    render() {
        this.showData(this.state.showData);
        let renderView = super.render();

        let selectArr = this.sumSelectedArr();
        return (
            <Container style={styles.container}>
                <KBHeader
                    isLeft={true} {...this.props}
                    title={'已有学生' + (this.state.isConnected ? '(' + selectArr.length + ')人' : '')}
                />
                {renderView}
            </Container>
        );
    }

    //底部按钮
    renderToolBarView() {
        let isSelectedAll = this.isSelectedAll();
        return (
            <View style={{
                height: 49,
                width: theme.screenWidth,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <KBButton style={{flex: 3}}
                          onPress={() => this.toolBarSelectAll()}>
                    <View style={{
                        flex: 3,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 49,
                        borderTopWidth: 0.5,
                        borderColor: colors.divider,
                    }}>
                        <Image style={{width: 20, height: 20}}
                               source={isSelectedAll ? image.classBtnChoiceS : image.classBtnChoiceD}/>
                        <Text style={{
                            fontSize: 15,
                            marginLeft: 5,
                        }}>全选</Text>
                    </View>
                </KBButton>
                <KBButton style={{flex: 4}} onPress={() => this.complete()}>
                    <View style={{
                        flex: 3,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 49,
                        backgroundColor: colors.yellowColor,
                    }}>
                        <Text style={{
                            fontSize: 15,
                            marginLeft: 5,
                            color: colors.text555,
                        }}>{'完成分组'}</Text>
                    </View>
                </KBButton>
            </View>
        );
    };


    isSelectedAll() {
        for (let obj of this.state.data) {
            if (!obj.isSelected) {
                return false;
            }
        }
        return true;
    }

    /**
     *  计算全选
     */
    sumSelectedArr() {
        let selectedArr = [];
        for (let obj of this.state.data) {
            if (obj.isSelected) {
                selectedArr.push(obj);
            }
        }
        return selectedArr;
    }

    /**
     * 全选
     */
    toolBarSelectAll() {
        let isSelectedAll = this.isSelectedAll();

        for (let obj of this.state.data) {
            obj.isSelected = !isSelectedAll;
        }

        this.setState({});
    }

    /**
     * 完成分组
     */
    complete() {
        let studentArr = [];
        for (let student of this.state.data) {
            if (student.isSelected) {
                studentArr.push(student);
            }
        }
        if (this.isEdit) {
            this.updateGroup(studentArr);
        }else {
            this.getGroupMember(studentArr);
        }
        this.goBack();
    }

    updateGroup = (studentArr) => {
        let students = [];
        for (let obj of studentArr) {
            let student = {};
            student.studentId = obj.id;
            student.percent = 1;
            students.push(student);
        }

        let formData = new FormData();

        formData.append('name', this.groupName);
        formData.append('classId', this.classId);
        formData.append('groupId', this.groupId);
        formData.append('sort', this.groupSort);
        formData.append('studentJson', JSON.stringify(students));
        HttpUtils.doPostWithToken(fetchUrl.updateGroup, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
               // this.onRefresh();
                this.eventEmitter.emit(GROUP_UPDATE);
               // this.goBack();

            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    }

    /**
     * cell 点击事件
     * @param index
     */
    itemClick = (item) => {
        item.isSelected = !item.isSelected;
        this.setState({});
    };

    // 搜索框点击事件
    // Important: You must return a Promise
    //获取焦点
    onFocus = (text) => {
        let allData = this.state.data;

        let showData = new Array();
        text = text.replace(/\s+/g, '');//去除空格 将空格设为""
        if (text == '') {
            showData = allData;
        } else {
            for (let obj of allData) {
                if (obj.name.search(text) >= 0) {
                    showData.push(obj);
                }
            }
        }

        this.setState({
            showData: showData,
        });
        return new Promise((resolve, reject) => {
            console.log('onFocus', text);
            resolve();
        });
    };
    //取消
    onCancel = (text) => {
        // 保存搜索时选择的cell
        let allData = this.state.data;

        this.setState({
            showData: allData,
        });
        return new Promise((resolve, reject) => {
            console.log('onFocus', text);
            resolve();
        });
    };
    //搜索
    onSearch = (text) => {
        let allData = this.state.data;
        let showData = new Array();

        for (let obj of allData) {
            if (obj.name.search(text) >= 0) {
                showData.push(obj);
            }
        }
        this.setState({
            showData: showData,
        });
        return new Promise((resolve, reject) => {
            console.log('onFocus', text);
            resolve();
        });
    };

    //输入内容
    onChangeText = (text) => {
        // let dataArray = this.state.studentList;
        let allData = this.state.data;
        let showData = new Array();
        text = text.replace(/\s+/g, '');//去除空格 将空格设为""
        if (text == '') {
            this.setState({
                showData: allData,
            });
            return;
        }
        // console.log("testing.....", text);
        for (let obj of allData) {
            if (obj.name.search(text) >= 0) {
                showData.push(obj);
            }
        }
        // console.log("show",showData);
        this.setState({
            showData: showData,
        });

        return new Promise((resolve, reject) => {
            console.log('onChange', text);
            resolve();
        });
    };

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
});
