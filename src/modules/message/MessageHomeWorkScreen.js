import React from 'react';
import {Image, StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';

import BaseScreen from '../../base/BaseScreen';

import KBHeader from '../../components/KBHeader';
import ItemModel from '../../components/tableView/ItemModel';
import Adapter from '../../components/tableView/Adapter';
import TableView, {PullRefreshMode} from '../../components/tableView';
import Divider from '../../components/Divider';
import KBAlertDialog from '../../components/dialog/KBAlertDialog';

import colors from '../../constants/colors';
import fetchUrl from '../../constants/fetchUrl';
import {MESSAGE_UPDATE} from '../../constants/notify';

import Utils from '../../utils/Utils';
import ToastUtils from '../../utils/ToastUtils';
import HttpUtils from '../../utils/HttpUtils';

import MessageHomeWorkHolder from './holder/MessageHomeWorkHolder';


export default class MessageHomeWorkScreen extends BaseScreen {

    constructor(props) {
        super(props);
        this.page = 1;
        this.totalPage = 0;
        this.tableKey = 0;
        this.state = Object.assign({
            data: [],
            lineNumber: null,
            imageUrls: [],
            imageIndex: 0,

        }, this.state);
        this.adapter = new Adapter();
        this.eventEmitter = DeviceEventEmitter;
    }

    getApiUrl() {
        return fetchUrl.getHomeworkList + '&page=' + this.page;
    }

    onSuccess(responseData) {
        if (responseData.data) {
            this.totalPage = responseData.data.totalPage;
            if (responseData.data.data && responseData.data.data.length) {
                for (let item of  responseData.data.data) {

                    let imageUrls = [];
                    if (!Utils.isNull(item.picUrl)) {
                        imageUrls = item.picUrl.split(',');
                    }
                    let itemModel = new ItemModel(this.tableKey, MessageHomeWorkHolder);
                    itemModel.setAttribute('data', item);
                    itemModel.setAttribute('imageUrls', imageUrls);
                    itemModel.setAttribute('itemDeleteClick', this.itemDeleteClick);
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
                    this.onNullData();
                }
            }
        }
    }


    renderNullDataView(): * {
        return super.renderNullDataView(require('../../assets/class/messageEmpty/message_task_empty.png'), ' 暂时没有任何作业');
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
            <View style={{ backgroundColor: colors.empty, flex: 1}}>
                <KBHeader
                    isLeft={true}
                    title={'作业'}
                    style={{backgroundColor: colors.white}}
                    headerStyle={'dark'}
                    {...this.props}
                />
                <Divider/>
                {renderView}
                <KBAlertDialog
                    ref={(c) => this.promptDialog = c}
                    content={'您确定删除此条作业吗?'}
                    rightPress={() => {
                        this.deleteTask();
                    }}/>
            </View>
        );
    };

    deleteTask = () => {
        let formData = new FormData();
        formData.append('id', this.taskId);
        HttpUtils.doPostWithToken(fetchUrl.deleteHomework, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                this.promptDialog.dismiss();
                if (this.deleteIndex !== -1) {
                    this.adapter.remove(this.deleteIndex);
                    // this.tableView.reloadData();
                    if (this.tableView) {
                        this.tableView.notifyDataSetChanged();
                        this.tableView.onRefreshComplete();
                    }

                    if (Utils.isNull(this.adapter.getDataScore()) || this.adapter.getDataScore().length === 0) {
                        this.onNullData();
                    }
                }
                this.deleteIndex = -1;
                this.eventEmitter.emit(MESSAGE_UPDATE);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    };

    itemDeleteClick = (index, taskId) => {
        this.deleteIndex = index;
        this.taskId = taskId;
        this.promptDialog.show();
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
}
