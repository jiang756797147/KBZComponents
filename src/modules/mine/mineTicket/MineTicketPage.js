import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import BaseScreen from '../../../base/BaseScreen';
import TableView, {PullRefreshMode} from '../../../components/tableView/index';
import ItemModel from '../../../components/tableView/ItemModel';
import Adapter from '../../../components/tableView/Adapter';
import fetchUrl from '../../../constants/fetchUrl';
import ToastUtils from '../../../utils/ToastUtils';
import HttpUtils from '../../../utils/HttpUtils';
import Utils from '../../../utils/Utils';

import TicketMineHolder from './view/TicketMineHolder';

export default class MineTicketPage extends BaseScreen {

    constructor(props) {
        super(props);
        this.page = 1;
        this.totalPage = 0;
        this.tableKey = 0;
        this.adapter = new Adapter();
        this.state = Object.assign({
            data: [],
        }, this.state);
    }

    getApiUrl() {
        return `${fetchUrl.queryAuditedTicketList}type=${this.props.type}&page=${this.page}&temp=${this.props.temp}`;
    }

    onSuccess(responseData) {
        if (responseData.data) {
            this.totalPage = responseData.data.totalPage;

            if (responseData.data.data && responseData.data.data.length > 0) {
                for (let ticket of responseData.data.data) {
                    ticket.delete = false;
                    let itemModel = new ItemModel(this.tableKey, TicketMineHolder);
                    itemModel.setAttribute('data', ticket);
                    itemModel.setAttribute('index', this.tableKey);
                    itemModel.setAttribute('gotoClassStar', this.gotoClassStar);
                    itemModel.setAttribute('gotoDetails', this.gotoTicketDetails);
                    itemModel.setAttribute('longPress', this.longPress);
                    itemModel.setAttribute('cancle', this.cancleLongPress);
                    itemModel.setAttribute('delete', this.deletePost);
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
                isShowDivider={true}
                dividerStyle={{customHeight: 1}}
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


    //跳转到奖扣单详情页
    gotoTicketDetails = (item) => {
        const {navigate} = this.props.navigation;
        navigate('MineTicketDetails', {
            'id': item.id
        });
    };


    //点击推荐跳转到班级之星界面
    gotoClassStar = (data) => {
        const {navigate} = this.props.navigation;
        navigate('ClassStar', {
            setRecomment: (star) => { // 设置星级成功刷新
                data.starLevel = star;
                this.setState({});
            },
            data: data,
        });
    };

    // 长按废除
    longPress = (data) => {
        data.delete = true;
        this.setState({});
    };

    //取消长按废除
    cancleLongPress = (data) => {
        data.delete = false;
        this.setState({});
    };

    //作废请求
    deletePost = (data) => {

        let formData = new FormData();
        formData.append('ticketId', data.id);
        formData.append('classId', data.classId);

        HttpUtils.doPostWithToken(fetchUrl.discardTicket, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                this.onDownRefresh();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },

        });

    };

    styles = StyleSheet.create({
        container: {
            backgroundColor: 'white',
            flex: 1,
        },
    });
}
