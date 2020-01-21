import React from 'react';
import {Button} from 'native-base';
import {Image, StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';

import BaseScreen from '../../base/BaseScreen';

import KBHeader from '../../components/KBHeader';
import ItemModel from '../../components/tableView/ItemModel';
import Adapter from '../../components/tableView/Adapter';
import TableView, {PullRefreshMode} from '../../components/tableView';
import Divider from '../../components/Divider';
import KBButton from '../../components/KBButton';

import colors from '../../constants/colors';
import fetchUrl from '../../constants/fetchUrl';
import theme from '../../constants/theme';
import {UPDATE_CONTACT} from '../../constants/notify';

import HttpUtils from '../../utils/HttpUtils';
import ToastUtils from '../../utils/ToastUtils';

import MessageApplyHolder from './holder/MessageApplyHolder';


export default class MessageApplyScreen extends BaseScreen {
    constructor(props) {

        super(props);
        this.state = Object.assign({

            data: [],
            isMultiple: false,

        }, this.state);

        this.adapter = new Adapter();
        this.eventEmitter = DeviceEventEmitter;
    }

    getApiUrl() {
        return fetchUrl.getApplyList;
    }

    onSuccess(responseData) {
        if (responseData.data) {
            let data = [];
            if (responseData.data.parentList || responseData.data.teacherList) {
                if (responseData.data.parentList && responseData.data.parentList.length > 0) {
                    let parentData = responseData.data.parentList;
                    for (let obj of parentData) {
                        obj.isParent = true;
                        obj.isSelected = false;
                        data.push(obj);
                    }
                }
                if (responseData.data.teacherList && responseData.data.teacherList.length > 0) {
                    let tearchData = responseData.data.teacherList;
                    for (let obj of tearchData) {
                        obj.isParent = false;
                        obj.isSelected = false;
                        data.push(obj);
                    }
                }
                for (let index = 0; index < data.length; index++) {
                    let itemModel = new ItemModel(index, MessageApplyHolder);
                    itemModel.setAttribute('data', data[index]);
                    itemModel.setAttribute('itemClick', this.itemClick);
                    itemModel.setAttribute('longPress', this.longPress);
                    itemModel.setAttribute('changStatus', this.changStatus);
                    itemModel.setAttribute('index', index);
                    itemModel.setAttribute('isMultiple', {
                        getIsMultiple: () => {
                            return this.state.isMultiple;
                        },
                    });
                    this.adapter.addItem(itemModel);
                }

                if (this.tableView) {
                    this.tableView.notifyDataSetChanged();
                    this.tableView.onRefreshComplete();
                }
            } else {

                // if (this.tableView) {
                //     this.tableView.onRefreshComplete();
                //     this.tableView.setHasMoreData(false);
                // }
                super.onNullData();

            }
        } else {
            super.onNullData();
        }
    }

    renderData() {

        return (
            <View style={{flex: 1 , backgroundColor: colors.white}}>
                <TableView
                    ref={(c) => {
                        this.tableView = c;
                    }}
                    mode={PullRefreshMode.PULL_FROM_START}
                    adapter={this.adapter}
                    onPullDownToRefresh={(tableView) => {
                        this.onDownRefresh();
                    }}
                    // onPullUpToRefresh={(tableView) => {
                    //     if (this.page >= this.totalPage) {
                    //         tableView.onRefreshComplete();
                    //         tableView.setHasMoreData(false);
                    //         return;
                    //     }
                    //     this.onUpRefresh();
                    // }}
                />
                {this.state.isMultiple ? this.renderBottom() : null}
            </View>
        );
    }

    renderBottom() {

        let selectedArray = this.getSelectedArray();
        return (
            <View style={{width: theme.screenWidth, height: 49, flexDirection: 'row'}}>
                <KBButton style={{flex: 1}}
                          onPress={() => this.multipleApply()}
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

    render() {
        let renderView = super.render();
        let isSelectedAll = this.getIsSelectedAll();

        return (
            <View style={styles.container}>
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
                    rightText={this.state.isMultiple ? (isSelectedAll ? '取消全选' : '全选') : this.state.isNullData ? '' :'编辑'}
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
                    title={'申请与验证'}
                    {...this.props}
                />
                <Divider customHeight={0.5}/>
                {renderView}
            </View>
        );
    };

    renderNullDataView(): * {
        return super.renderNullDataView(require('../../assets/class/messageEmpty/message_apply_empty.png'), '暂时没有任何验证消息');
    }

    /**
     * 刷新
     */
        //下拉刷新
    onDownRefresh = () => {
        this.adapter.removeAll();
        this.componentDidMount();
    };

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
        if (this.state.isMultiple) {
            data.isSelected = !data.isSelected;
            this.setState({});
        }
    };

    getSelectedArray() {
        let array = [];
        let dataSource = this.adapter.getDataScore();
        if (dataSource && dataSource.length > 0) {
            for (let itemModel of dataSource) {
                let data = itemModel.getAttrbute('data');
                if (data.isSelected) {
                    let ticket = {};
                    ticket.applyId = data.applyId;
                    ticket.type = 1;
                    ticket.target = data.isParent ? 0 : 1;

                    array.push(ticket);
                }
            }
        }
        return array;
    }

    itemClick = (data, dealType) => {

        let applyId = data.applyId;

        let formData = new FormData();
        formData.append('applyId', applyId);
        formData.append('type', dealType);
        let url = data.isParent ? fetchUrl.agreeParentIntoClass : fetchUrl.agreeIntoClass;

        this.postRequest(url, formData);
    };

    /**
     * 长按删除
     * @param index
     */
    longPress(index) {

        // ToastUtils.showToast("删除");
    };

    multipleApply = () => {

        let selectedData = this.getSelectedArray();
        let formData = new FormData();
        let auditJson = JSON.stringify(selectedData);
        formData.append('auditJson', auditJson);
        let url = fetchUrl.agreeParentTeacherClass;

        this.postRequest(url, formData);

    };

    postRequest = (url, formData) => {
        HttpUtils.doPostWithToken(url, formData, {
            onSuccess: (responseData) => {
                this.eventEmitter.emit(UPDATE_CONTACT);
                ToastUtils.showToast(responseData.message);
                this.setState({
                    isMultiple: false,
                }, () => {
                    this.onDownRefresh();
                });
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.empty,
        flex: 1,
    },
});
