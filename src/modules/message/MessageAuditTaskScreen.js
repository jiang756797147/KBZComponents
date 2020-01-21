import React from 'react';
import {StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';

import BaseScreen from '../../base/BaseScreen';

import KBHeader from '../../components/KBHeader';
import ItemModel from '../../components/tableView/ItemModel';
import Adapter from '../../components/tableView/Adapter';
import TableView, {PullRefreshMode} from '../../components/tableView';
import KBAlertDialog from '../../components/dialog/KBAlertDialog';
import Divider from '../../components/Divider';

import colors from '../../constants/colors';
import fetchUrl from '../../constants/fetchUrl';
import {MESSAGE_UPDATE} from '../../constants/notify';

import Utils from '../../utils/Utils';
import TimeUtils from '../../utils/TimeUtils';
import HttpUtils from '../../utils/HttpUtils';
import ToastUtils from '../../utils/ToastUtils';

import MessageAuditTaskHolder from './holder/MessageAuditTaskHolder';

export default class MessageAuditTaskScreen extends BaseScreen {


    constructor(props) {
        super(props);
        this.page = 1;
        this.totalPage = 0;
        this.tableKey = 0;
        this.state = Object.assign({
            data: [],
        }, this.state);

        this.eventEmitter = DeviceEventEmitter;
        this.adapter = new Adapter();

        this.auditType = 0; //0: 未审核 1：通过 2：拒绝 3： 终止
        this.taskData = {}; //当前任务
    }

    getApiUrl() {
        return `${fetchUrl.getAuditTaskData}page=${this.page}`;
    }

    onSuccess(responseData) {
        if (responseData.data) {
            this.totalPage = responseData.data.totalPage;
            if (responseData.data.data && responseData.data.data.length > 0) {
                for (let item of  responseData.data.data) {

                    item.date = TimeUtils.getTimeWithSecond(item.create_at);
                    item.week = TimeUtils.getWeekWithChina(item.create_at);
                    item.headUrl = Utils.getTeacherAvatar(item.header, item.sex);
                    let itemModel = new ItemModel(this.tableKey, MessageAuditTaskHolder);
                    itemModel.setAttribute('data', item);
                    itemModel.setAttribute('audit', this.taskAudit);
                    itemModel.setAttribute('navigation', this.props.navigation);
                    this.adapter.addItem(itemModel);
                    this.tableKey++;
                }
                if (this.tableView) {
                    this.tableView.notifyDataSetChanged();
                    this.tableView.onRefreshComplete();
                }

            } else {
                if (this.tableView) {
                    this.tableView.onRefreshComplete();
                    this.tableView.setHasMoreData(false);
                }
                if (this.page === 1) {
                    super.onNullData();
                }
            }
        }
    }


    renderData() {
        return (
            <TableView
                ref={(c) => {
                    this.tableView = c;
                }}
                mode={PullRefreshMode.BOTH}
                adapter={this.adapter}
                onPullDownToRefresh={(tableView) => {
                    this.onDownRefresh();
                }}
                onPullUpToRefresh={(tableView) => {
                    if (this.page >= this.totalPage) {
                        tableView.onRefreshComplete();
                        tableView.setHasMoreData(false);
                        return;
                    }
                    this.onUpRefresh();
                }}
            />
        );
    }

    render() {
        let renderView = super.render();
        return (
            <View style={this.styles.container}>
                <KBHeader
                    isLeft={true}
                    title={'任务消息'}
                    headerStyle={'dark'}
                    {...this.props}
                />

                <Divider/>
                {renderView}
                <KBAlertDialog
                    ref={(c) => this.dialog = c}
                    title={this.auditType === 3 ? '温馨提示' : ''}
                    contentComponent={() => this.renderDialogContent()}
                    rightPress={() => {
                        this.auditTask();
                    }}/>
            </View>
        );
    };

    renderDialogContent = () => {
        let passTitle = '确定通过任务吗？';
        let rejectTitle = '确定不通过任务吗？';
        let passContent = '本周期结束后，若未进行该操作，将自动给予任务通过并给学生加分。';
        let rejectContent = '若未通过，参与本任务的学生将无法在本周期获得加分。';

        let title = this.auditType === 1 ? passTitle : this.auditType === 2 ? rejectTitle : null;
        let content = this.auditType === 1 ? passContent : this.auditType === 2 ? rejectContent : null;

        return (
            this.auditType === 3 ?
                <Text style={[{
                    marginHorizontal: 14,
                    marginTop: 15,
                    lineHeight: 20,
                    color: colors.text333,
                }]}>{'确定终止任务吗？'}</Text>
                :
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    paddingVertical: 40,
                    paddingHorizontal: 20,
                }}>
                    <Text style={{fontSize: 17, color: colors.text333}}>{title}</Text>
                    <Text style={{
                        fontSize: 15,
                        marginVertical: 20,
                        color: colors.text555,
                        lineHeight: 20,
                    }}>{content}</Text>
                </View>
        );
    };

    taskAudit = (auditType, data) => {
        this.taskData = data;
        if (auditType < 4) {
            this.auditType = auditType;
            this.setState({}, () => {
                this.dialog.show();
            });
        } else {
            const {navigate} = this.props.navigation;
            navigate('Task', {
                classId: this.classId,
                taskData: data,
            });
        }
    };


    auditTask = () => {
        let formData = new FormData();
        formData.append('taskId', this.taskData.tid);
        formData.append('classId', this.classId);
        formData.append('status', this.auditType);

        HttpUtils.doPostWithToken(fetchUrl.auditTaskScore, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                this.onDownRefresh();
                this.eventEmitter.emit(MESSAGE_UPDATE);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    };

    //下拉刷新
    onDownRefresh = () => {
        this.page = 1;
        this.tableKey = 0;
        this.adapter.removeAll();
        this.componentDidMount();
    };

    //上拉加载
    onUpRefresh = () => {
        ++this.page;
        this.componentDidMount();
    };

    styles = StyleSheet.create({
        container: {
            backgroundColor: colors.empty,
            flex: 1,
        },
    });
}
