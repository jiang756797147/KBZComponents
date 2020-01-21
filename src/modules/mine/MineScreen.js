import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';
import BaseScreen from '../../base/BaseScreen';

import KBButton from '../../components/KBButton';
import KBScrollView from '../../components/KBScrollView';
import KBAlertDialog from '../../components/dialog/KBAlertDialog';

import HttpUtils from '../../utils/HttpUtils';
import ToastUtils from '../../utils/ToastUtils';
import Utils from '../../utils/Utils';

import fetchUrl from '../../constants/fetchUrl';
import theme from '../../constants/theme';
import colors from '../../constants/colors';
import UserData from '../../constants/UserData';
import {THIRD_LOGIN_UNBIND} from '../../constants/notify';
import CircleImage from '../../components/CircleImage';

import ShareUtil from '../../umeng/ShareUtil';

export default class MineScreen extends BaseScreen {

    mineData = [
        {
            itemName: '我的奖票审核',
            icon: require('../../assets/class/my_ic_shen.png'),
            pressTag: 'MineTicket',
            temp: '1',
        },
        {
            itemName: '我的积分申请',
            icon: require('../../assets/class/my_ic_apply.png'),
            pressTag: 'MineTicket',
            temp: '2',
        },
    ];
    classSetting = [
        {itemName: '任务分', icon: require('../../assets/class/my_ic_task.png'), pressTag: 'TaskRecord'},
        {itemName: '固定分', icon: require('../../assets/class/my_ic_fix.png'), pressTag: 'FixedHistory'},
    ];
    ticketPrint = [
        {itemName: '奖票打印', icon: require('../../assets/class/my_ic_print.png'), pressTag: 'TicketPrintRecord'},
    ];
    data = [

        {itemName: '账号安全', icon: require('../../assets/class/my_ic_safe.png'), pressTag: 'UserSafe'},
        {itemName: '绑定微信', icon: require('../../assets/third_login_weixin.png'), pressTag: ''},
        {itemName: '意见反馈', icon: require('../../assets/class/my_ic_opinion.png'), pressTag: 'FeedBack'},
        {
            itemName: '帮助说明',
            icon: require('../../assets/class/my_ic_help.png'),
            pressTag: 'WebView',
            params: {title: '帮助说明', url: fetchUrl.webBaseUrl + 'index/page/teacher_instruction.html'},
        },
        {
            itemName: '关于我们', icon: require('../../assets/class/my_ic_about_us.png'), pressTag: 'WebView',
            params: {title: '关于我们', url: fetchUrl.webBaseUrl + 'index/page/teacher_aboutus.html'},
        },
    ];
    teamData = [
        {teamName: '班主任'},
        {teamName: '教学教研组'},
    ];


    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            userData: UserData.getInstance().getUserData(),
        };
        this.eventEmitter = DeviceEventEmitter;
        UserData.getInstance().registerUserDataListener(() => {
            this.refreshData();
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.getUserInfo();
    }

    getUserInfo = () => {
        HttpUtils.doGetWithToken(fetchUrl.getUserInfo, {
            onSuccess: (responseData) => {
                this.setState({userData: responseData.data});
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);

            },
            onEnd: () => {
                this.setState({isRefreshing: false});
            },
        }, fetchUrl.loginBaseUrl);
    };

    renderItem = ({itemName, icon, pressTag, temp, params}, index, data) => {
        let thirdOpenId = UserData.getInstance().getUserData().openid;
        let isBind = Utils.isNull(thirdOpenId) ? false : true;
        const {navigate} = this.props.navigation;
        return (
            <View key={index}>
                <KBButton onPress={() => {
                    if (index === 1 && itemName === '绑定微信') {
                        if (isBind) {
                            this.dialog.show();
                        } else {
                            this.bind('wechat');
                        }
                    } else {
                        navigate(pressTag, {'temp': temp, 'params': params});
                    }
                }}>
                    <View style={{
                        borderTopLeftRadius: index === 0 ? 7 : 0,
                        borderTopRightRadius: index === 0 ? 7 : 0,
                        borderBottomRightRadius: index === data.length - 1 ? 7 : 0,
                        borderBottomLeftRadius: index === data.length - 1 ? 7 : 0,
                        backgroundColor: colors.white,
                        paddingVertical: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Image source={icon} style={{width: 18, height: 18, marginLeft: 14}} resizeMode={'contain'}/>
                        <Text style={{fontSize: 14, marginLeft: 15, color: colors.text333}}>{itemName}</Text>
                        {index === 1 && itemName === '绑定微信' ? <Text style={{
                            position: 'absolute',
                            right: 10,
                            fontSize: 13,
                            color: colors.text999,
                        }}>{isBind ? '已绑定' : '未绑定'}</Text> : null}
                    </View>
                </KBButton>
            </View>
        );
    };

    renderTeam = (teamName, index) => {
        return index < 3 ?
            <View key={index} style={{
                height: 20,
                borderRadius: 2,
                alignItems: 'center',
                paddingHorizontal: 7,
                backgroundColor: '#D3AA2C',
                justifyContent: 'center',
                marginRight: 10,
            }}>
                <Text style={{color: colors.white, fontSize: 13, opacity: 0.9}}>{teamName}</Text>
            </View> : null
            ;
    };

    renderData() {
        const {navigate} = this.props.navigation;
        return (
            <KBScrollView
                style={this.styles.container}
                showsVerticalScrollIndicator={false}
                isRefreshControl={true}
                isRefreshing={this.state.isRefreshing}
                onRefresh={this.refreshData}
            >
                <View style={this.styles.container}>
                    <KBAlertDialog
                        ref={(c) => this.dialog = c}
                        content={'确定解除微信绑定吗？'}
                        rightBtnText={'确定解绑'}
                        rightPress={() => this.unbind('wechat')}
                    />
                    <View style={this.styles.viewForHeader}>
                        <Image resizeMode={'cover'}
                               style={{
                                   width: theme.screenWidth,
                                   height: 30 / 75 * theme.screenWidth,
                                   position: 'absolute',
                               }}
                               source={require('../../assets/my_bg_new.jpg')}/>
                        <KBButton onPress={() => {
                            navigate('MineData');
                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 25}}>
                                <View>
                                    <CircleImage customWidth={60}
                                                 customHeight={60}
                                                 imageUrl={Utils.getMineAvatar(this.state.userData.header, this.state.userData.sex)}
                                    />
                                </View>

                                <View style={{marginLeft: 14}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{
                                            fontSize: 16,
                                            color: colors.text333,
                                        }}>{this.state.userData.nickname}</Text>
                                        <Image source={require('../../assets/class/my_ic_title.png')}
                                               resizeMode={'contain'}
                                               style={{width: 13, height: 13, marginLeft: 7}}/>
                                        <Text style={{
                                            fontSize: 13,
                                            color: colors.text333,
                                            marginLeft: 2,
                                        }}>{Utils.getNoNullText(this.state.userData.duty)}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', marginTop: 10}}>
                                        {Utils.isNull(this.state.userData.remark) ? null : this.state.userData.remark.split(',').map(this.renderTeam)}
                                    </View>
                                </View>
                            </View>
                        </KBButton>
                    </View>
                    <View style={this.styles.viewForBody}>
                        <View style={{marginTop: 10}}>
                            {this.mineData.map(this.renderItem)}
                        </View>
                        <View style={{marginTop: 10}}>
                            {this.classSetting.map(this.renderItem)}
                        </View>
                        <View style={{marginTop: 10}}>
                            {this.ticketPrint.map(this.renderItem)}
                        </View>
                        <View style={{marginTop: 10}}>
                            {this.data.map(this.renderItem)}
                        </View>
                        <KBButton onPress={() => {
                            navigate('Settings');
                        }}>
                            <View style={this.styles.itemView}>
                                <Image source={require('../../assets/class/my_ic_set_up.png')}
                                       style={{width: 18, height: 18, marginLeft: 14}}
                                       resizeMode={'contain'}/>
                                <Text style={{fontSize: 14, marginLeft: 15, color: colors.text333}}>设置</Text>
                            </View>
                        </KBButton>
                    </View>
                </View>
            </KBScrollView>
        );
    }

    refreshData = () => {
        this.setState({isRefreshing: true});
        this.componentDidMount();
    };
    //绑定
    bind = (tag) => {
        let platform = 2;
        // 授权登录
        ShareUtil.auth(platform, (code, result, message) => {
            if (code === 200 || code === 0) {
                let formData = new FormData();
                formData.append("openid", result.openid);
                formData.append("accessToken", result.accessToken);
                formData.append("platform", tag);
                HttpUtils.doPostWithToken(fetchUrl.tokenBindThirdAccount, formData, {
                    onSuccess: (responseData) => {
                        ToastUtils.showToast('绑定成功');
                        UserData.getInstance().getUserData().openid = result.openid;
                        this.setState({});
                    },
                    onFail: (responseData) => {
                        ToastUtils.showToast(responseData.message);
                    }
                });
            } else {
                ToastUtils.showToast(message);
            }
        });
    };

    //解绑
    unbind = (tag) => {
        let formData = new FormData();
        formData.append("platform", tag);
        HttpUtils.doPostWithToken(fetchUrl.unlinkThirdAccount, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast('解绑成功！');
                UserData.getInstance().getUserData().openid = '';
                this.setState({});
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            }
        });
    };

    styles = StyleSheet.create({
        container: {
            backgroundColor: '#F7F6F3',
            flex: 1,
        },
        viewForHeader: {
            zIndex: 1,
            width: theme.screenWidth,
            height: 28 / 75 * theme.screenWidth,
            justifyContent: 'center',
            flexDirection: 'column-reverse',
            paddingHorizontal: 14,
        },
        viewForBody: {
            borderTopLeftRadius: 7,
            borderTopRightRadius: 7,
            marginHorizontal: 12,
            zIndex: 2,
            // marginTop: 10,
            backgroundColor: colors.trans,
        },
        textForMyClassTitle: {
            color: colors.text333,
            fontWeight: '400',
            fontSize: 14,
            marginLeft: 14,
        },
        viewForMyClassAll: {
            flexDirection: 'row',
            paddingHorizontal: 14,
            alignItems: 'center',
            paddingVertical: 14,
        },
        itemView: {
            borderRadius: 7,
            backgroundColor: colors.white,
            marginVertical: 10,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
        },
    });
}
