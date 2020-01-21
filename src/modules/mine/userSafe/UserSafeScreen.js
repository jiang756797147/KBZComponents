import React, {Component} from "react"
import {Container} from 'native-base'
import {Image, StyleSheet, Text, View} from "react-native";
import KBHeader from "../../../components/KBHeader";
import colors from "../../../constants/colors";
import image from "../../../constants/image";
import UserData from "../../../constants/UserData";
import KBButton from "../../../components/KBButton";
import Divider from '../../../components/Divider';
import Utils from "../../../utils/Utils";

import ShareUtil from '../../../umeng/ShareUtil';
import ToastUtils from "../../../utils/ToastUtils";
import HttpUtils from "../../../utils/HttpUtils";
import fetchUrl from "../../../constants/fetchUrl";

export default class UserSafeScreen extends Component {

    thirdLoginArray = [
        {
            icon: '',
            name: '微信',
            tag: 'wechat',
        },
    ];

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={this.styles.container}>
                <KBHeader isLeft={true} title={'账号安全'} {...this.props}/>
                <View style={{flex: 1}}>

                    <View style={[this.styles.itemStyle, {marginTop: 15}]}>
                        <Text style={[this.styles.itemTextStyle,]}>绑定手机</Text>
                        <Text style={{fontSize: 13, color: colors.text888, marginTop: 5}}>
                            {this._getIphoneNum()}
                        </Text>
                    </View>
                    <Divider/>
                    <View>
                        <KBButton onPress={() => {
                            const {navigate} = this.props.navigation;
                            navigate('ResetPwd');
                        }}>
                            <View style={[this.styles.itemStyle, {
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }]}>
                                <Text style={this.styles.itemTextStyle}>设置登录密码</Text>
                                <Image style={{width: 7, height: 13}} source={image.itemArrowImage}/>
                            </View>
                        </KBButton>
                    </View>

                    {/*<View style={{marginTop: 30}}>*/}
                        {/*<Text style={{marginLeft: 20, color: colors.text888, fontSize: 13}}>第三方登录</Text>*/}
                        {/*<View style={{marginTop: 10}}>*/}
                            {/*{this.thirdLoginArray.map(this.renderThirdItem)}*/}
                        {/*</View>*/}
                    {/*</View>*/}
                </View>
            </View>
        );
    }

    renderThirdItem = (item, index) => {
        let thirdOpenId = UserData.getInstance().getUserData().openid;
        let isBind = Utils.isNull(thirdOpenId) ? false : true;
        // let isBind = true;
        return (
            <View key={index}
                  style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                      paddingVertical: 15,
                      backgroundColor: colors.white
                  }}
            >
                <View style={{flexDirection: 'row'}}>
                    <Image/>
                    <Text style={this.styles.itemTextStyle}>{item.name}</Text>
                </View>
                <KBButton onPress={() => {
                    this.updateBind(isBind, item.tag);
                }}>
                    <View style={{
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: isBind ? colors.bossgreen : colors.colorB1,
                        paddingHorizontal: 10,
                        paddingVertical: 5
                    }}>
                        <Text style={{color: isBind ? colors.bossgreen : colors.colorB1}}>{isBind ? '解绑' : '绑定'}</Text>
                    </View>
                </KBButton>
            </View>
        )
    };

    _getIphoneNum() {
        let iphoneNum = UserData.getInstance().getUserData().mobile;

        return `${iphoneNum.substr(0, 3)}****${iphoneNum.substr(7)}`;
    }

    updateBind = (isBind, tag) => {
        if (isBind) {
            this.unbind(tag);
        } else {
            this.bind(tag);
        }
    };

    //绑定
    bind = (tag) => {

        let platform = 2;
        let formData = new FormData();
        // 授权登录
        ShareUtil.auth(platform, (code, result, message) => {
            if (code === 200 || code === 0) {
                formData.append("openid", result.openid);
                formData.append("accessToken", result.accessToken);
                formData.append("platform", tag);
                HttpUtils.doPostWithToken(fetchUrl.tokenBindThirdAccount, formData, {
                    onSuccess: (responseData) => {
                        ToastUtils.showToast(responseData.message);
                        UserData.getInstance().getUserData().openid = result.openid;
                        this.setState({});
                    },
                    onFail: (responseData) => {
                        ToastUtils.showToast(responseData.message);
                    }
                });
            }else {
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
                ToastUtils.showToast(responseData.message);
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
            backgroundColor: colors.empty,
            flex: 1
        },

        itemStyle: {
            paddingHorizontal: 20,
            paddingVertical: 15,
            backgroundColor: colors.white,
            justifyContent: 'center'
        },
        itemTextStyle: {
            fontSize: 15,
            color: colors.text333,
        }
    });

}
