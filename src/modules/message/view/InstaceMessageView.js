import React from 'react';
import {Image, StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';
import PropTypes from 'prop-types';
import BaseScreen from '../../../base/BaseScreen';

import KBButton from '../../../components/KBButton';
import KBDisplayImages from '../../../components/KBDisplayImages';
import CircleImage from '../../../components/CircleImage';
import KBText from '../../../components/KBText';

import TimeUtils from '../../../utils/TimeUtils';
import Utils from '../../../utils/Utils';

import colors from '../../../constants/colors';
import {MESSAGE_UPDATE, UPDATE_CONTACT, CHANGE_SELECTEDTAB} from '../../../constants/notify';
import fetchUrl from '../../../constants/fetchUrl';
import HttpUtils from '../../../utils/HttpUtils';
import ToastUtils from '../../../utils/ToastUtils';


export default class InstaceMessageView extends BaseScreen {

    static defaultProps = {
        instanceType: '0', // 0:首页;1:消息列表
        isRefreshing: false,
        request: function () {

        },
    };

    static propTypes = {
        instanceType: PropTypes.string.isRequired,
        request: PropTypes.func,
        isRefreshing: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = Object.assign({
            messageList: [],
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

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        if (nextProps.isRefreshing) {
            this.updateMessage();
        }
    }

    updateMessage() {
        this.componentDidMount();
    }

    getApiUrl() {
        return `${fetchUrl.getMessage}type=${this.props.instanceType}`;
    }

    onSuccess(responseData) {
        this.setState({
            messageList: responseData.data,
        });
    }

    render() {
        let contentView = this.props.instanceType === '0' ? this.renderHomeView() : this.renderMessageView();
        return (
            <View style={{flex: 1}}>
                {
                    this.state.messageList && this.state.messageList.length > 0 ?
                        contentView : null
                }
            </View>
        );
    }


    // 首页待办事项
    renderHomeView() {
        return (
            <View style={{marginTop: 5, paddingHorizontal: 15, marginBottom: 10}}>
                <View style={{flexDirection: 'row', paddingTop: 10, justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 16, color: colors.text333}}>
                        待办事项
                    </Text>
                    <KBButton onPress={() => {
                        this.eventEmitter.emit(CHANGE_SELECTEDTAB);
                    }}>
                        <Text style={{fontSize: 14, color: colors.text333}}>
                            更多
                        </Text>
                    </KBButton>
                </View>
                {this.state.messageList.map(this.renderMatterItem)}
            </View>
        );
    }

    renderMessageView() {
        return (
            <View style={{backgroundColor: colors.divider}}>
                {this.state.messageList.map(this.renderMatterItem)}
            </View>
        );
    }

    renderNullDataView() {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Image resizeMode={'contain'}
                       source={require('../../../assets/class/messageEmpty/message_empty.png')}
                       style={{width: 100, height: 110}}/>
                <Text style={{fontSize: 14, color: colors.text888, marginTop: 20}}>{'暂时没有任何消息'}</Text>
            </View>
        );
    }

    // type: 0:公告; 1:作业; 2: pc登录 3:审核; 4:教师申请加入班级; 5:家长申请加入班级; 6:积分申请 7:任务分 8：固定分 9：二维码
    renderMatterItem = (item, index) => {

        let images = item.content_json.image;

        let hasAudit = item.type.value === 3 || item.type.value === 4 || item.type.value === 5 || item.type.value === 6 || item.type.value === 7;

        return (
            <View key={index} style={{
                marginTop: 10,
                backgroundColor: colors.white,
                borderRadius: 5,
                borderColor: colors.divider,
                borderWidth: 1,
                paddingHorizontal: 15,
                paddingVertical: 5,
            }}>
                <View style={{paddingVertical: 10}}>
                    <Text
                        style={{fontSize: 16, color: colors.text333, fontWeight: '900'}}>{`${item.type.text}消息`}</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: colors.divider}}/>
                {
                    hasAudit ?
                        this.renderItemAuditContent(item, images) : this.renderItemContent(item, images)
                }
                {
                    hasAudit ? this.renderItemButton(item) : null
                }

            </View>
        );
    };


    renderItemContent(item, images) {
        return (
            <View style={{marginTop: 10, flex: 1}}>
                <KBText style={{
                    fontSize: 16,
                    color: colors.text555,
                    lineHeight: 20,
                }}>{item.content}</KBText>
                <View style={{marginTop: 5}}>
                    {images && images.length > 0 ?
                        <KBDisplayImages imgWidth={80}
                                         ticketImgs={images} isNetwork={true}/> : null}
                </View>

                <Text style={{
                    fontSize: 13,
                    color: colors.text888,
                    marginVertical: 5,
                }}>{Utils.isNull(item.create_at) ? '' : item.create_at}</Text>
            </View>
        );
    }

    renderItemAuditContent(item, images) {
        let date = new Date(item.create_at) / 1000;
        let weekStr = !Utils.isNull(item.create_at) && item.type.value === 7 ? TimeUtils.getWeekWithChina(date) : '';
        return (
            <View style={{marginTop: 10}}>
                <View style={{flex: 1}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <CircleImage customWidth={50} customHeight={50}
                                     imageUrl={item.type.value === 4 ? Utils.getTeacherAvatar(item.create_header, item.create_sex.value) : Utils.getStudentAvatar(item.create_header, item.create_sex.value)}/>
                        <View style={{flex: 1, marginLeft: 10, justifyContent: 'center'}}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <Text style={{
                                    fontSize: 15,
                                    color: colors.text333,
                                }}>{item.create_name}</Text>
                                {item.type.value === 4 || item.type.value === 5 ?
                                    null :
                                    <Text style={{
                                        fontSize: 16,
                                        color: Utils.isNull(item.content_json.score) ? colors.trans : parseInt(item.content_json.score) > 0 ? '#5AA6EA' : '#F7734B',
                                    }}>{Utils.getScore(item.content_json.score)}</Text>
                                }
                            </View>
                            <Text style={{
                                fontSize: 13,
                                color: colors.text888,
                                marginTop: 5,
                            }}>{Utils.isNull(item.create_at) ? '' : `${item.create_at} ${weekStr}`}</Text>
                        </View>
                    </View>

                    <Text style={{
                        marginLeft: 5,
                        marginTop: 15,
                        fontSize: 16,
                        color: colors.text555,
                    }}>{item.content_json.content}</Text>

                    <View style={{marginTop: 5}}>
                        {images && images.length > 0 ?
                            <KBDisplayImages imgWidth={80}
                                             ticketImgs={images} isNetwork={true}/> : null}
                    </View>
                </View>
            </View>
        );
    }

    renderItemButton(item) {
        return (
            <View style={{marginVertical: 5, flexDirection: 'row', justifyContent: 'flex-end'}}>

                {/*item.type.value === 4 || item.type.value === 5 ?*/}
                {/*null :*/}
                <KBButton onPress={() => {
                    this.props.request(item, 2);
                }}>
                    <View style={{
                        backgroundColor: colors.yellowColor,
                        width: 75,
                        height: 28,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}>
                        <Text style={{
                            fontSize: 15,
                            color: colors.white,
                        }}>{item.type.value === 7 ? '不通过' : item.type.value === 4 || item.type.value === 5 ? '不同意' : '驳回'}</Text>
                    </View>
                </KBButton>

                <KBButton onPress={() => {
                    this.props.request(item, 1);
                }}>
                    <View style={{
                        marginLeft: 10,
                        width: 75,
                        height: 28,
                        borderWidth: 1,
                        borderRadius: 14,
                        borderColor: colors.yellowColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={{
                            fontSize: 15,
                            color: colors.yellowColor,
                        }}>{item.type.value === 4 || item.type.value === 5 ? '同意' : '通过'}</Text>
                    </View>
                </KBButton>
            </View>
        );
    }


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

    dealAuditRequest = () => {

        if (this.ticket.type.value === 7) {
            this.dealTask();
        } else if (this.ticket.type.value === 4 || this.ticket.type.value === 5) {
            this.dealApplyRequest();
        } else {
            this.dealTicket();
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

    dealTask = () => {
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

    dealTicket = () => {
        let toastText = this.dealType === 1 ? '通过成功' : '驳回成功';
        let formData = new FormData();
        formData.append('ticketId', this.ticket.event_id);
        formData.append('type', this.dealType);
        // 添加驳回理由
        if (this.dealType === 2) {
            let rejectText = this.rejectPop.getText();
            formData.append('comment', rejectText);
        }
        console.log('formdata ================', formData);
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

    styles = StyleSheet.create({
        container: {
            backgroundColor: colors.white,
            flex: 1,
        },
    });

}
