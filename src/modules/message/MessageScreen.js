import React from 'react';
import {Image, StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';

import BaseScreen from '../../base/BaseScreen';

import KBHeader from '../../components/KBHeader';
import KBButton from '../../components/KBButton';
import Adapter from '../../components/tableView/Adapter';
import KBScrollView from '../../components/KBScrollView';
import KBAlertDialog from '../../components/dialog/KBAlertDialog';

import ToastUtils from '../../utils/ToastUtils';
import HttpUtils from '../../utils/HttpUtils';
import Utils from '../../utils/Utils';
import theme from '../../constants/theme';

import colors from '../../constants/colors';
import {MESSAGE_RELEASE, MESSAGE_UPDATE, MESSAGE_REDNUM_UPDATE, UPDATE_CONTACT} from '../../constants/notify';
import fetchUrl from '../../constants/fetchUrl';

import InstaceMessageView from './view/InstaceMessageView';
import MessageReleaseDialog from './view/MessageReleaseDialog';

export default class MessageScreen extends BaseScreen {

    messageData = [
        {
            iconSrc: require('../../assets/class/message/message_notice.png'),
            itemName: '公告',
            newsNum: 0,
            pressTag: 'MessageNotice',
        },
        {
            iconSrc: require('../../assets/class/message/message_task.png'),
            itemName: '作业',
            newsNum: 0,
            pressTag: 'MessageHomeWork',
        },
        {
            iconSrc: require('../../assets/class/message/message_please.png'),
            itemName: '审核',
            newsNum: 0,
            pressTag: 'MessageAuditTicket',  //全选
        },
        {
            iconSrc: require('../../assets/class/message/message_audit.png'),
            itemName: '任务',
            newsNum: 0,
            pressTag: 'MessageAuditTask',
        },
        {
            iconSrc: require('../../assets/class/message/message_apply.png'),
            itemName: '验证消息',
            newsNum: 0,
            pressTag: 'MessageApply',
        },

    ];

    constructor(props) {
        super(props);
        this.adapter = new Adapter();
        this.state = Object.assign({
            isRefreshing: false,

            messageList: [],
            isNoData: false,

            dialogContent: '',
            isTextInput: false,
        }, this.state);

        this.eventEmitter = DeviceEventEmitter;
    }

    UNSAFE_componentWillMount() {
        super.UNSAFE_componentWillMount();

        this.eventEmitter.addListener(MESSAGE_UPDATE, this.updateMessage.bind(this));
        this.eventEmitter.addListener(UPDATE_CONTACT, this.updateMessage.bind(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.eventEmitter.removeListener(MESSAGE_UPDATE, this.updateMessage);
        this.eventEmitter.removeListener(UPDATE_CONTACT, this.updateMessage);
    }

    componentDidMount() {
        super.componentDidMount();
    }

    updateMessage() {
        this.onRefresh();
    }


    getApiUrl() {
        return fetchUrl.getRedPointNum;
    }

    onSuccess(responseData) {

        if (responseData.data) {
            this.messageData[0].newsNum = responseData.data.classNoticeNum;
            this.messageData[1].newsNum = responseData.data.homeworkNum;
            this.messageData[2].newsNum = responseData.data.unreadMessagesNum + responseData.data.examineNum;
            this.messageData[3].newsNum = 0;
            // this.messageData[4].newsNum = responseData.data.sysNoticeNum;
            this.messageData[4].newsNum = responseData.data.applyNum;

            this.sumRedNum = parseInt(responseData.data.unreadMessagesNum) + parseInt(responseData.data.classNoticeNum) + parseInt(responseData.data.homeworkNum) + parseInt(responseData.data.examineNum) + parseInt(responseData.data.applyNum);
            this.eventEmitter.emit(MESSAGE_REDNUM_UPDATE, {redNum: this.sumRedNum});
            this.setState({});
        }
    }

    onNullData(responseData) {
        super.onNullData();
    }

    onEnd() {
        super.onEnd();
        this.setState({isRefreshing: false});
    }

    renderData() {
        return (
            <KBScrollView
                isRefreshControl={true}
                isRefreshing={this.state.isRefreshing}
                onRefresh={this.onRefresh}
                style={{flex: 1}}
            >
                <View style={{flex: 1}}>
                    <View style={{
                        width: theme.screenWidth,
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        backgroundColor: colors.white,
                    }}>
                        {this.messageData.map(this.renderItem)}
                    </View>

                    <InstaceMessageView
                        instanceType={'1'}
                        request={this.dealRequest}
                        isRefreshing={this.state.isRefreshing}
                    />
                </View>

            </KBScrollView>
        );
    }

    render() {
        let renderView = super.render();
        return (
            <View style={this.styles.container}>
                <KBHeader
                    isLeft={false}
                    title={'消息'}
                    style={{backgroundColor: colors.yellowColor}}
                />
                {renderView}
                <KBButton style={{
                    position: 'absolute',
                    right: 20,
                    bottom: 50,
                }}
                          onPress={() => {
                              this.messageRelease.show();
                          }}
                >
                    <View style={[{
                        width: 60,
                        height: 60,
                    }, theme.isAndroid ? {
                        position: 'absolute',
                        right: 20,
                        bottom: 50,
                    } : null,
                    ]}>
                        <Image style={{width: 60, height: 60}} resizwMode={'contain'}
                               source={require('../../assets/class/message/message_bounced.png')}/>
                    </View>
                </KBButton>

                <KBAlertDialog
                    ref={(c) => this.rejectPop = c}
                    content={this.state.dialogContent}
                    rightPress={() => this.dealConformRequest()}
                    isTextInput={this.state.isTextInput}
                />
                <MessageReleaseDialog
                    ref={(c) => this.messageRelease = c}
                    navigation={this.props.navigation}
                />
            </View>
        );
    }

    renderItem = (item, index) => {
        // console.log("item nmum", item.newsNum);
        return (
            <KBButton key={index}
                      onPress={() => {
                          this.sumRedNum = this.sumRedNum - this.messageData[index].newsNum;
                          this.messageData[index].newsNum = 0;

                          this.setState({}, () => {
                              this.eventEmitter.emit(MESSAGE_REDNUM_UPDATE, {redNum: this.sumRedNum});
                          });
                          const {navigate} = this.props.navigation;
                          navigate(item.pressTag, {index: index});
                      }}
            >
                <View style={{
                    width: theme.screenWidth / 5,
                    height: 70,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomWidth: index < 4 ? 1 : 0,
                    borderColor: colors.divider,
                }}>
                    <Image style={{width: 30, height: 30}} resizeMode={'contain'} source={item.iconSrc}/>
                    <Text style={{marginTop: 8, fontSize: 12, color: colors.text666}}>
                        {item.itemName}
                    </Text>

                    {Utils.isNull(item.newsNum) || item.newsNum == 0 ?
                        null
                        :
                        <View style={{position: 'absolute', width: theme.screenWidth / 4, height: 70}}>
                            <View style={{
                                position: 'absolute',
                                top: 7,
                                left: theme.screenWidth / 8 + 5,
                                paddingHorizontal: item.newsNum.toString().length > 1 ? 5 : 7,
                                height: 14,
                                borderRadius: 6,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: colors.orangeRed,
                            }}>
                                <Text style={{
                                    fontSize: 11,
                                    color: colors.white,
                                    textAlign: 'center',
                                }}>{item.newsNum > 999 ? '999+' : item.newsNum}</Text>
                            </View>
                        </View>
                    }
                </View>
            </KBButton>
        );
    };

    onRefresh = () => {
        this.setState({isRefreshing: true});
        this.componentDidMount();
    };

    dealRequest = (data, dealType) => {
        let toast = '';
        if (dealType === 1) { // 通过提示
            toast = data.type.value === 4 || data.type.value === 5 ? '您确定同意加入班级的申请吗?' : '您确定要通过吗?';
        } else { // 驳回提示
            toast = data.type.value === 4 || data.type.value === 5 ? '您确定驳回加入班级的申请吗?' : data.type.value === 7 ? '您确定不通过吗?' : '您确定要删除吗?';
        }
        this.ticket = data;
        this.dealType = dealType;
        this.setState({
            dialogContent: toast,
            isTextInput: dealType === 2 && (data.type.value === 3 || data.type.value === 6),
        }, () => {
            this.rejectPop.show();
        });
    };

    dealConformRequest = () => {

        if (this.ticket.type.value === 7) {
            this.dealTaskRequest();
        } else if (this.ticket.type.value === 4 || this.ticket.type.value === 5) {
            this.dealApplyRequest();
        } else {
            this.dealAuditRequest();
        }
    };

    dealApplyRequest = () => {

        let formData = new FormData();
        formData.append('applyId', this.ticket.event_id);
        formData.append('type', this.dealType);
        let url = this.ticket.type.value === 5 ? fetchUrl.agreeParentIntoClass : fetchUrl.agreeIntoClass;
        HttpUtils.doPostWithToken(url, formData, {
            onSuccess: (responseData) => {
                this.eventEmitter.emit(UPDATE_CONTACT);
                ToastUtils.showToast(responseData.message);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    };

    dealAuditRequest = () => {

        let toastText = this.dealType === 1 ? '通过成功' : '驳回成功';
        let formData = new FormData();
        formData.append('ticketId', this.ticket.event_id);
        formData.append('type', this.dealType);
        // 添加驳回理由
        if (this.dealType === 2) {
            let rejectText = this.rejectPop.getText();
            formData.append('comment', rejectText);
        }
        HttpUtils.doPostWithToken(fetchUrl.dealTicket, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(toastText);
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

    dealTaskRequest = () => {

        let toastText = this.dealType === 1 ? '任务通过成功' : '任务驳回成功';
        let formData = new FormData();
        formData.append('taskId', this.ticket.event_id);
        formData.append('status', this.dealType);

        HttpUtils.doPostWithToken(fetchUrl.auditTaskScore, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(toastText);
                this.eventEmitter.emit(MESSAGE_UPDATE);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    };

    styles = StyleSheet.create({
        container: {
            backgroundColor: colors.white,
            flex: 1,
        },
        contentText: {
            fontSize: 13,
            color: colors.text666,
            lineHeight: 20,
        },
    });

}
