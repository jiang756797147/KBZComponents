import React from 'react';
import {Container} from 'native-base';
import {Image, StyleSheet, Text, View} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';

import BaseScreen from '../../../base/BaseScreen';
import KBHeader from '../../../components/KBHeader';
import KBButton from '../../../components/KBButton';
import Divider from '../../../components/Divider';
import KBAlertDialog from '../../../components/dialog/KBAlertDialog';
import fetchUrl from '../../../constants/fetchUrl';
import colors from '../../../constants/colors';
import ToastUtils from '../../../utils/ToastUtils';
import StorageUtils from '../../../utils/StorageUtils';
import HttpUtils from '../../../utils/HttpUtils';
import CacheHelper from '../../../utils/CacheHelper';
import Utils from '../../../utils/Utils';
import UserData from '../../../constants/UserData';


import PushUtil from '../../../umeng/PushUtil';

export default class SettingsScreen extends BaseScreen {
    settingData = [
        {itemName: '个人资料', pressTag: 'MineData'},
        {itemName: '移除缓存', pressTag: ''},
        {itemName: '消息推送', pressTag: ''},

    ];

    constructor(props) {
        super(props);
        this.state = Object.assign({
            cacheSize: '',
        }, this.state);

        this.getCacheSize();
        this.pushType = UserData.getInstance().getPushType();
    }

    renderData() {
        return (
            <View style={this.styles.container}>
                <KBHeader isLeft={true} headerStyle={'dark'} {...this.props} title="设置"/>
                {this.settingData.map(this.renderItem)}
                <KBButton onPress={() => {
                    this.logOutDialog.show()
                }}>
                    <View style={{
                        marginHorizontal: 20,
                        height: 42,
                        marginTop: 50,
                        backgroundColor: '#FFDA48',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 21,
                    }}>
                        <Text style={{fontSize: 15, color: colors.text333}}>退出登录</Text>
                    </View>
                </KBButton>
                <KBAlertDialog
                    ref={(c) => this.logOutDialog = c}
                    content={'确定退出家校积分通吗？'}
                    rightPress={() => {
                        this.logout();
                    }}
                />
                <KBAlertDialog
                    ref={(c) => this.dialog = c}
                    content={'确定清除缓存？'}
                    rightPress={() => {
                        this.dialog.dismiss();
                        this.removeFileCache();
                    }}
                />
            </View>
        );
    }

    setPushType = () => {

        this.pushType = Utils.isNull(this.pushType) ? '0' : '';

        let formData = new FormData();
        formData.append('pushType', this.pushType);

        HttpUtils.doPostWithToken(fetchUrl.setPushStatus, formData, {
            onSuccess: (responseData) => {
                UserData.getInstance().setPushType(this.pushType);
                this.setState({});
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    };

    renderItem = ({itemName, pressTag}, index) => {

        const {navigate} = this.props.navigation;
        return (
            <KBButton key={index} onPress={() => {
                if (index === 0) {
                    navigate(pressTag);
                } else if (index === 2) {
                    this.setPushType();
                } else {
                    this.dialog.show();
                }
            }}>
                <View style={{backgroundColor: colors.white}}>
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: 14,
                        justifyContent: 'space-between',
                        paddingVertical: 16,
                    }}>
                        <Text style={{fontSize: 15, color: colors.text333}}>{itemName}</Text>
                        <View style={{flexDirection: 'row'}}>
                            {
                                index === 1 ?
                                    <Text style={{
                                        marginRight: 10,
                                        fontSize: 13,
                                        color: colors.text888,
                                    }}>{this.state.cacheSize}</Text> : null
                            }
                            {

                                index === 2 ?
                                    <KBButton onPress={() => this.setPushType()}>
                                        <Image style={{height: 20, width: 36}}
                                               source={Utils.isNull(this.pushType) ? require('../../../assets/notice_close.png') : require('../../../assets/notice_open.png')}/>
                                    </KBButton>
                                    :
                                    <Image source={require('../../../assets/icon_right.png')} resizeMode={'contain'}
                                           style={{width: 14, height: 14}}/>
                            }
                        </View>
                    </View>

                    <Divider isMargin={false} customHeight={(index == 1) ? 0 : 1}/>
                </View>
            </KBButton>
        );
    };

    removeFileCache() {
        CacheHelper.clearCache();
        this.getCacheSize();
    }

    getCacheSize() {

        CacheHelper.getCacheSizeFormat()
            .then((result) => {
                this.setState({cacheSize: result});
            })
            .catch((err) => {
                console.log('err ========', err);
            });
    }

    logout = () => {
        let formData = new FormData();
        HttpUtils.doPostWithToken(fetchUrl.logout, formData, {
            onSuccess: (responseData) => {

                let userInfo = UserData.getInstance().getUserData();

                let alias = userInfo.push;
                this.removeUmengPush(alias);

                StorageUtils._remove('token');
                let resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'Login'}),//要跳转到的页面名字
                    ],
                });
                this.props.navigation.dispatch(resetAction);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        }, fetchUrl.loginBaseUrl);
    };

    removeUmengPush = (alias) => {
        PushUtil.deleteAlias(alias, 'KBZXY', (code) => {
            //退出账号移除推送别名
            console.log('友盟推送别名移除：', alias);
            console.log('友盟推送别名移除状态码：', code);
        });
    }

    styles = StyleSheet.create({
        container: {
            backgroundColor: 'white',
            flex: 1,
        },
    });
}
