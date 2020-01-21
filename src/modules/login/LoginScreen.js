import React, {Component} from "react"
import {Container} from 'native-base'
import {Image, Text, View, StyleSheet, Keyboard, InteractionManager} from "react-native";
import {NavigationActions, StackActions} from "react-navigation"

import TextInputWithClear from "../../components/TextInputWithClear";
import KBButton from "../../components/KBButton";
import theme from "../../constants/theme";
import fetchUrl from "../../constants/fetchUrl";
import UserData from "../../constants/UserData";
import colors from "../../constants/colors";

import Utils from "../../utils/Utils";
import HttpUtils from "../../utils/HttpUtils";
import ToastUtils from "../../utils/ToastUtils";
import StorageUtils from "../../utils/StorageUtils";

import ShareUtil from '../../umeng/ShareUtil';
import PushUtil from '../../umeng/PushUtil';

export default class LoginScreen extends Component {

    constructor(props) {

        super(props);
        this.state = {
            canLogin: true,
            orgCode: "",
            username: "",
            password: "",
            isOrgFocus: false,
            isNameFocus: false,
            isPwdFocus: false,
            isSaveUser: false,
        };

        StorageUtils._load("isSaveTeacher", (data) => {
            this.setState({
                isSaveUser: data
            });
        }, (err) => {
            this.setState({
                isSaveUser: false
            })
        });
        StorageUtils._load("teacherInfo", (data) => {
            if (!Utils.isNull(data)) {
                let orderCode = Utils.isNull(data.orgCode) ? '' : data.orgCode;
                let username = Utils.isNull(data.username) ? '' : data.username;
                let password = Utils.isNull(data.password) ? '' : data.password;
                this.setState({
                    orgCode: orderCode,
                    username: username,
                    password: password,
                });
            }
        }, (err) => {
            this.setState({
                orgCode: "",
                username: "",
                password: "",
            })
        })
    }

    render() {
        return (
            <View style={this.styles.container}>
                <Image source={require('../../assets/bg_login.jpg')}
                       style={{width: theme.screenWidth, height: theme.screenHeight, position: 'absolute'}}
                       resizeMode={'cover'}/>
                <View style={{alignItems: 'center'}}>
                    <Image source={require('../../assets/class/Login_icon.png')}
                           style={{width: 60, height: 60, marginTop: 40}}
                           resizeMode={'contain'}/>
                    <Image source={require('../../assets/icon_login_title.png')} resizeMode={'contain'}
                           style={{marginTop: 15, width: 125, height: 16}}/>
                </View>
                <View style={[this.styles.viewForInput, {marginTop: 50}]}>
                    <Image
                        source={this.state.isOrgFocus ? require('../../assets/class/login_ic_company_s.png') :
                            require('../../assets/class/login_ic_company_n.png')}
                        style={{width: 17, height: 17}}
                        resizeMode={'contain'}/>
                    <TextInputWithClear ref={(c) => this.orgEdit = c} onFocusUnderlineColor={'#F9DB63'}
                                        unFocusUnderlineColor={'#E0E0E0'} keyboardType={'numeric'}
                                        viewStyle={{marginLeft: 14}} placeholderText={'学校编号'}
                                        onInputFocus={() => {
                                            this.setState({
                                                isOrgFocus: true,
                                                isNameFocus: false,
                                                isPwdFocus: false,
                                            })
                                        }}
                                        onInputBlur={() => {
                                            this.setState({
                                                isOrgFocus: false,
                                            })
                                        }}
                                        value={this.state.orgCode}
                                        onTextChange={(text) => {
                                            this.setState({
                                                orgCode: text,
                                            }, () => {
                                                this.getLoginStatus()
                                            });
                                        }}
                                        inputStyle={{height: 40}}
                    />
                </View>
                <View style={this.styles.viewForInput}>
                    <Image
                        source={this.state.isNameFocus ? require('../../assets/class/login_ic_phone_s.png') :
                            require('../../assets/class/login_ic_phone_n.png')}
                        style={{width: 17, height: 17}}
                        resizeMode={'contain'}/>
                    <TextInputWithClear ref={(c) => this.nameEdit = c} onFocusUnderlineColor={'#F9DB63'}
                                        unFocusUnderlineColor={'#E0E0E0'}
                                        onInputFocus={() => {
                                            this.setState({
                                                isOrgFocus: false,
                                                isNameFocus: true,
                                                isPwdFocus: false,
                                            })
                                        }}
                                        onInputBlur={() => {
                                            this.setState({
                                                isNameFocus: false,
                                            })
                                        }}
                                        value={this.state.username}
                                        onTextChange={(text) => {
                                            this.setState({
                                                username: text,
                                            }, () => {
                                                this.getLoginStatus()
                                            });
                                        }}
                                        viewStyle={{marginLeft: 14}} placeholderText={'账号'} inputStyle={{height: 40}}/>
                </View>
                <View style={this.styles.viewForInput}>
                    <Image
                        source={this.state.isPwdFocus ? require('../../assets/class/login_ic_password_s.png') :
                            require('../../assets/class/login_ic_password_n.png')}
                        style={{width: 17, height: 17}}
                        resizeMode={'contain'}/>
                    <TextInputWithClear ref={(c) => this.pwdEdit = c} onFocusUnderlineColor={'#F9DB63'}
                                        unFocusUnderlineColor={'#E0E0E0'}
                                        value={this.state.password}
                                        onTextChange={(text) => {
                                            this.setState({
                                                password: text,
                                            }, () => {
                                                this.getLoginStatus()
                                            });
                                        }}
                                        onInputFocus={() => {
                                            this.setState({
                                                isOrgFocus: false,
                                                isNameFocus: false,
                                                isPwdFocus: true,
                                            })
                                        }}
                                        onInputBlur={() => {
                                            this.setState({
                                                isPwdFocus: false,
                                            })
                                        }}
                                        secureTextEntry={true}
                                        viewStyle={{marginLeft: 14}} placeholderText={'密码'} inputStyle={{height: 40}}/>
                </View>
                <KBButton onPress={() => {
                    this.setState({
                        isSaveUser: !this.state.isSaveUser,
                    }, () => {
                        StorageUtils._sava("isSaveTeacher", this.state.isSaveUser);
                    });
                }}>
                    <View style={this.styles.viewForInput}>
                        <Image style={{
                            width: 17,
                            height: 17,
                        }}
                               source={this.state.isSaveUser ? require('../../assets/class/login_remeber_s.png') : require('../../assets/class/login_remeber_n.png')}/>
                        <Text style={{fontSize: 13, color: colors.text666, marginLeft: 10}}>记住密码</Text>
                    </View>
                </KBButton>
                <KBButton onPress={() => this.login()}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 42,
                        borderRadius: 21,
                        marginTop: 40,
                        backgroundColor: '#FCD963'
                    }}>
                        <Text style={{
                            fontSize: 15,
                            color: this.state.canLogin ? colors.text333 : colors.text888
                        }}>登录</Text>
                    </View>
                </KBButton>
                {this.renderThirdLogin()}
            </View>
        );
    }

    renderThirdLogin() {
        return (
            <View style={{flex: 1, marginTop: 15, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 15, color: colors.text666}}>{'————  其他登录方式  ————'}</Text>
                <KBButton onPress={() => {
                    this.thirdLoginInfo();
                }}>
                    <View style={{marginTop: 10}}>
                        <Image style={{width: 40, height: 40}} source={require('../../assets/third_login_weixin.png')}/>
                    </View>
                </KBButton>
            </View>
        )
    }

    thirdLoginInfo() {
        let platform = 2;
        // 授权登录
        ShareUtil.auth(platform, (code, result, message) => {

            if (code === 200 || code === 0) {
                let formData = new FormData();
                formData.append("openid", result.openid);
                formData.append("accessToken", result.accessToken);
                formData.append("platform", 'wechat');

                formData.append("deviceToken", this.deviceToken);

                HttpUtils.doPost(fetchUrl.thirdLogin, formData, {
                    onSuccess: (responseData) => {

                        // let alias = responseData.data.user.push;;
                        // this.regUmengPush(alias);

                        if (responseData.code === 1001) { //单个绑定
                            UserData.getInstance().saveData(responseData.data.user);
                            UserData.getInstance().setClassIds(responseData.data.classIds);
                            let resetAction = StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({routeName: 'MainTabPage'})//要跳转到的页面名字
                                ]
                            });
                            this.props.navigation.dispatch(resetAction);
                        } else { // code === 3001
                            const {navigate} = this.props.navigation;
                            navigate('TirdLoginList', {
                                data: responseData.data,
                            })
                        }
                    },
                    onFail: (responseData) => {
                        ToastUtils.showToast(responseData.message);
                    }
                });
            } else {
                ToastUtils.showToast(message);
            }
        });
    }

    login = () => {
        if (this.state.canLogin) {
            if (this.state.isSaveUser) {
                let userInfo = {
                    "orgCode": this.state.orgCode,
                    "username": this.state.username,
                    "password": this.state.password,
                };
                StorageUtils._sava("teacherInfo", userInfo);
            } else {
                StorageUtils._remove('teacherInfo');
            }

            let formData = new FormData();
            formData.append("orgCode", this.state.orgCode);
            formData.append("username", this.state.username);
            formData.append("password", this.state.password);

            HttpUtils.doPost(fetchUrl.login, formData, {
                onSuccess: (responseData) => {
                    // AnalyticsUtil.profileSignInWithPUID(this.nameEdit.getText());

                    let alias = responseData.data.user.push;
                    this.regUmengPush(alias);

                    InteractionManager.runAfterInteractions(() => {
                        UserData.getInstance().saveData(responseData.data.user);
                        UserData.getInstance().setClassIds(responseData.data.classIds);
                        Keyboard.dismiss();
                        let resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({routeName: 'MainTabPage'})//要跳转到的页面名字
                            ]
                        });
                        this.props.navigation.dispatch(resetAction);

                    });
                },
                onFail: (responseData) => {
                    ToastUtils.showToast(responseData.message)
                },
                onNullData: (responseData) => {

                },
                onEnd: (responseData) => {

                }
            }, fetchUrl.loginBaseUrl)
        }
    };

    regUmengPush = (alias) => {

        PushUtil.addAlias(alias, 'KBZXY', (code) => {
            //登录成功添加推送别名
            console.log('友盟推送别名设置：', alias);
            console.log('友盟推送别名设置状态码：', code);
        });
    };

    getLoginStatus = () => {
        if (Utils.isNull(this.state.orgCode) || Utils.isNull(this.state.username) || Utils.isNull(this.state.password)) {
            this.setState({canLogin: false});
        } else {
            this.setState({canLogin: true});
        }
    };

    styles = StyleSheet.create({
        container: {
            backgroundColor: colors.white,
            paddingHorizontal: 35,
            flex: 1
        },
        viewForInput: {
            flexDirection: 'row',
            marginTop: 15,
            alignItems: 'center'
        }
    });
}
