import React from 'react';
import {Button} from 'native-base';
import {Image, StyleSheet, Text, View} from 'react-native';
import BaseScreen from '../../base/BaseScreen';

import KBHeader from '../../components/KBHeader';
import KBButton from '../../components/KBButton';
import TableView, {PullRefreshMode} from '../../components/tableView';
import Adapter from '../../components/tableView/Adapter';
import ItemModel from '../../components/tableView/ItemModel';
import KBAlertDialog from '../../components/dialog/KBAlertDialog';

import colors from '../../constants/colors';
import fetchUrl from '../../constants/fetchUrl';
import theme from '../../constants/theme';
import {MESSAGE_UPDATE} from '../../constants/notify';

import Utils from '../../utils/Utils';
import ToastUtils from '../../utils/ToastUtils';
import HttpUtils from '../../utils/HttpUtils';

import MessageAuditHolder from './holder/MessageAuditHolder';


export default class MessageAuditTicketScreen extends BaseScreen {


    constructor(props) {
        super(props);

        this.page = 1;
        this.totalPage = 0;
        this.tableKey = 0;
        this.adapter = new Adapter();
        this.state = Object.assign({
            isTextInput: false,
            dialogContent: '',
            imageUrls: [],
            isMultiple: false,    //是否多选
        }, this.state);

    }

    getApiUrl() {
        return fetchUrl.getAuditTicket + 'page=' + this.page;
    }

    onSuccess(responseData) {
        if (responseData.data) {
            this.totalPage = responseData.data.totalPage;

            if (responseData.data.data && responseData.data.data.length > 0) {
                for (let item of responseData.data.data) {
                    item.isSelected = false;

                    let imageArray = [];
                    if (!Utils.isNull(item.image)) {
                        let imagesUrls = item.image.split(',');
                        for (let image of imagesUrls) {
                            imageArray.push(image);
                        }
                    }
                    let itemModel = new ItemModel(this.tableKey, MessageAuditHolder);
                    itemModel.setAttribute('data', item);
                    itemModel.setAttribute('imageArray', imageArray);
                    itemModel.setAttribute('dealClick', this.dealClick);
                    itemModel.setAttribute('changStatus', this.changStatus);
                    itemModel.setAttribute('isMultiple', {
                        getIsMultiple: () => {
                            return this.state.isMultiple;
                        },
                    });
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
            <View style={{flex: 1}}>
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
                {this.state.isMultiple ? this.renderBottom() : null}
            </View>
        );
    }

    renderNullDataView(): * {
        return super.renderNullDataView(require('../../assets/class/messageEmpty/message_audit_empty.png'), '暂时没有任何审核消息');
    }

    render() {
        let renderView = super.render();

        let isSelectedAll = this.getIsSelectedAll();
        return (
            <View style={{backgroundColor: colors.empty, flex: 1}}>
                <KBHeader
                    leftComponent={() => {
                        return (
                            <Button transparent onPress={() => {
                                if (this.state.isMultiple) {
                                    this.setState({
                                        isMultiple: false,
                                    });
                                } else {
                                    const {goBack} = this.props.navigation;
                                    goBack();
                                }
                            }} style={{
                                position: 'absolute',
                                left: 0,
                                width: 50,
                                height: theme.withoutStatusHeight,
                                top: 0,
                            }}>
                                {this.state.isMultiple ?
                                    <Text style={{marginLeft: 20}}>取消</Text>
                                    :
                                    <Image
                                        source={require('../../assets/icon_back_black.png')}
                                        style={{
                                            marginLeft: 20,
                                            width: 10,
                                            height: 15,
                                        }}/>
                                }
                            </Button>
                        );
                    }}
                    rightStyle={{fontSize: 15, color: colors.text888}}
                    rightText={this.state.isMultiple ? (isSelectedAll ? '取消全选' : '全选') : this.state.isNullData ? '' : '编辑'}
                    touchRight={() => {
                        if (this.state.isNullData) {
                            return;
                        }
                        if (this.state.isMultiple) {
                            this.changedAllStatus(!isSelectedAll);
                        } else {
                            this.setState({
                                isMultiple: true,
                            });
                        }
                    }}
                    title={this.type == 2 ? '积分申请' : '审核消息'}

                    {...this.props}
                />
                {renderView}

                <KBAlertDialog
                    ref={(c) => this.rejectPop = c}
                    content={this.state.dialogContent}
                    rightPress={() => this.dealTicket()}
                    isTextInput={this.state.isTextInput}
                />
            </View>
        );
    }

    renderBottom() {
        let selectedArray = this.getSelectedArray();
        return (
            <View style={{width: theme.screenWidth, height: 49, flexDirection: 'row'}}>
                <KBButton style={{flex: 1}}
                          onPress={() => {
                              let ticketId = selectedArray.join(',');
                              this.dealClick(ticketId, null, 1);
                          }}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: colors.yellowColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{fontSize: 17, color: colors.text555}}>{`通过(${selectedArray.length})`}</Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    getSelectedArray() {
        let array = [];
        let dataSource = this.adapter.getDataScore();
        if (dataSource && dataSource.length > 0) {
            for (let itemModel of dataSource) {
                let data = itemModel.getAttrbute('data');
                if (data.isSelected) {
                    array.push(data.id);
                }
            }
        }
        return array;
    }

    getIsSelectedAll() {
        let dataSource = this.adapter.getDataScore();
        for (let itemModel of dataSource) {
            let isSelected = itemModel.getAttrbute('data').isSelected;
            if (!isSelected) {
                return false;
            }
        }
        return true;
    }

    changedAllStatus(isSelected) {
        let dataSource = this.adapter.getDataScore();
        for (let itemModel of dataSource) {
            itemModel.getAttrbute('data').isSelected = isSelected;
        }
        this.setState({});
    }

    changStatus = (data) => {
        let {navigate} = this.props.navigation;
        if (this.state.isMultiple) {
            data.isSelected = !data.isSelected;
            this.setState({});
        } else {
            navigate('TicketDetailsScreen', {
                id: data.id,
                // type: data.type,
                refresh: this.onDownRefresh,
            });    //2：家长申请  1：家长奖票
        }
    };

    dealClick = (ticketId, index, type) => {
        this.ticketId = ticketId;
        this.dealType = type;
        this.setState({
            dialogContent: type === 1 ? '您确定要通过吗?' : '您确定要删除吗?',
            isTextInput: type === 1 ? false : true,
        }, () => {
            this.rejectPop.show();
        });
    };


    dealTicket = () => {

        let toastText = this.dealType == 1 ? '通过成功' : '驳回成功';
        let formData = new FormData();
        formData.append('ticketId', this.ticketId);
        formData.append('type', this.dealType);
        // 添加驳回理由
        if (this.dealType == 2) {
            let rejectText = this.rejectPop.getText();
            formData.append('comment', rejectText);
        }
        HttpUtils.doPostWithToken(fetchUrl.dealTicket, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(toastText);
                this.setState({
                    isMultiple: false,
                }, () => {
                    this.onDownRefresh();
                    this.eventEmitter.emit(MESSAGE_UPDATE);
                });
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
