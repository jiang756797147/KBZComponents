import React from 'react';
import BaseScreen from '../../base/BaseScreen';
import {StyleSheet, View, DeviceEventEmitter} from 'react-native';

import KBHeader from '../../components/KBHeader';
import ItemModel from '../../components/tableView/ItemModel';
import Adapter from '../../components/tableView/Adapter';
import TableView, {PullRefreshMode} from '../../components/tableView';
import Divider from '../../components/Divider';
import KBAlertDialog from '../../components/dialog/KBAlertDialog';

import colors from '../../constants/colors';
import fetchUrl from '../../constants/fetchUrl';
import {MESSAGE_UPDATE} from '../../constants/notify';

import ToastUtils from '../../utils/ToastUtils';
import Utils from '../../utils/Utils';
import TimeUtils from '../../utils/TimeUtils';
import HttpUtils from '../../utils/HttpUtils';

import MessageNoticeHolder from './holder/MessageNoticeHolder';


export default class MessageNoticeScreen extends BaseScreen {


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
        return fetchUrl.getNoticeList + 'type=0&' + 'page=' + this.page;
    }

    onSuccess(responseData) {
        if (responseData.data) {
            this.totalPage = responseData.data.totalPage;
            if (responseData.data.data && responseData.data.data.length > 0) {
                for (let item of  responseData.data.data) {
                    let imageArray = [];

                    if (!Utils.isNull(item.picUrl)) {
                        let imagesUrls = item.picUrl.split(',');
                        for (let image of imagesUrls) {
                            // let imageUrl = Utils.getImageThumbnail() + image;
                            imageArray.push(image);
                        }

                    }

                    item.date = TimeUtils.getTimeWithSecond(item.createAt);
                    item.week = TimeUtils.getWeekWithChina(item.createAt);
                    item.headUrl = Utils.getTeacherAvatar(item.userHeader, item.userSex);
                    let itemModel = new ItemModel(this.tableKey, MessageNoticeHolder);
                    itemModel.setAttribute('data', item);
                    itemModel.setAttribute('imageArray', imageArray);
                    itemModel.setAttribute('itemDeleteClick', this.itemDeleteClick);
                    itemModel.setAttribute('confirmNoticeClick', this.confirmNoticeClick);
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

    renderNullDataView(): * {
        return super.renderNullDataView(require('../../assets/class/messageEmpty/message_class_empty.png'), '暂时没有任何公告');
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
            <View style={{backgroundColor: colors.empty, flex: 1}}>
                <KBHeader
                    isLeft={true}
                    title={'班级公告'}
                    style={{backgroundColor: colors.white}}
                    headerStyle={'dark'}
                    {...this.props}
                />
                <Divider/>
                {renderView}
                <KBAlertDialog
                    ref={(c) => this.promptDialog = c}
                    content={'您确定删除此条公告吗?'}
                    rightPress={() => {
                        this.deleteNotice();
                    }}/>
            </View>
        );
    };

    deleteNotice = () => {
        let formData = new FormData();
        formData.append('id', this.noticeId);
        HttpUtils.doPostWithToken(fetchUrl.deleteNotice, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                this.promptDialog.dismiss();
                if (this.deleteIndex !== -1) {
                    this.adapter.remove(this.deleteIndex);
                    if (this.tableView) {
                        this.tableView.notifyDataSetChanged();
                        this.tableView.onRefreshComplete();
                    }
                    if (Utils.isNull(this.adapter.getDataScore()) || this.adapter.getDataScore().length === 0) {
                        // this.setState({isNullData: true});
                        super.onNullData();
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

    itemDeleteClick = (index, noticeId) => {
        this.deleteIndex = index;
        this.noticeId = noticeId;
        this.promptDialog.show();
    };

    confirmNoticeClick = (noticeId, index) => {
        let formData = new FormData();
        formData.append('noticeId', noticeId);
        HttpUtils.doPostWithToken(fetchUrl.confirmNotice, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                this.adapter.getItem(index).getAttrbute('data').confirmNum++;
                this.adapter.getItem(index).getAttrbute('data').readSwitch = 1;
                // this.tableView.reloadData();

                if (this.tableView) {
                    this.tableView.notifyDataSetChanged();
                    this.tableView.onRefreshComplete();
                }

            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
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
}
