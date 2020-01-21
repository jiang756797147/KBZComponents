import React from "react";
import {Animated, DeviceEventEmitter, NativeModules, View} from 'react-native'
import {NavigationActions, StackActions} from "react-navigation"
import RNSplash from 'react-native-splash-screen'
import BaseScreen from "../base/BaseScreen";
import HttpUtils from "../utils/HttpUtils";
import StorageUtils from "../utils/StorageUtils";
import ToastUtils from "../utils/ToastUtils";
import DialogUtils from "../utils/DialogUtils";
import theme from "../constants/theme";
import UserData from "../constants/UserData";
import fetchUrl from "../constants/fetchUrl";
import {UPDATE_ANDROID, HTTP_NOTIFY} from "../constants/notify";
import PushUtil from "../umeng/PushUtil";


export default class SplashPage extends BaseScreen {

    constructor(props) {
        super(props);
        this.interval = 1000;
        this.startTimes = new Date().getTime();
        this.state = Object.assign({
            fadeVal: new Animated.Value(0)
        }, this.state);
        this.eventEmitter = DeviceEventEmitter;
        DialogUtils.getInstance().setNavigation(this.props.navigation);
    }

    UNSAFE_componentWillMount(): void {
        if (theme.isAndroid) {
            this.eventEmitter.addListener(UPDATE_ANDROID, this.update_callback.bind(this));
        }
        this.eventEmitter.addListener(HTTP_NOTIFY, this.splash_hidden.bind(this));
    }

    componentWillUnmount() {
        if (theme.isAndroid) {
            this.eventEmitter.removeListener(UPDATE_ANDROID, this.update_callback);
        }
        this.eventEmitter.removeListener(HTTP_NOTIFY, this.splash_hidden);
    }

    splash_hidden = () => {
        RNSplash.hide();
    }

    componentDidMount() {
        // 下载最新Apk
        if (theme.isAndroid) {
            HttpUtils.doGet(fetchUrl.checkUpdate, {
                onSuccess: (responseData) => {
                    let data = responseData.data;

                    NativeModules.upgrade.upgrade(data.apkUrl, fetchUrl.loginBaseUrl + fetchUrl.checkUpdate,
                        data.versionCode, data.versionName, data.md5, data.size);
                },
                onFail: (responseData) => {
                    ToastUtils.showToast(responseData.message);
                    this.login();
                },
                onError: (errorMsg) => {
                    // ToastUtils.showToast(errorMsg);
                    this.login();
                },
                onNullData: (responseData) => {
                    ToastUtils.showToast(responseData.message);
                    this.login();
                },
            }, fetchUrl.loginBaseUrl)}
        else {
            this.login();
        }
    }


    update_callback = (e) => {
        if (e.isError) {
            ToastUtils.showToast("检查更新失败,请联系管理员");
            this.login();
        }
        if (!e.needUpdate) {
            console.log("11111111111111", e.needUpdate);
            this.login();
        }
    };

    login = () => {
        HttpUtils.doGetWithToken(fetchUrl.autoLogin, {
            onSuccess: (responseData) => {


                UserData.getInstance().saveData(responseData.data.user);
                UserData.getInstance().setClassIds(responseData.data.classIds);
                this.goToPage('MainTabPage');
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
                StorageUtils._remove("token");
                this.goToPage('Login');
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
                StorageUtils._remove("token");
                this.goToPage('Login');
            },
            onError: (errorMsg) => {
                // ToastUtils.showToast(errorMsg);
                StorageUtils._remove("token");
                this.goToPage('Login');
            },
            onEnd: () => {
                // this.goToPage('Login');
            }
        }, fetchUrl.loginBaseUrl);
    };

    goToPage(name) {
        let resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: name})//要跳转到的页面名字
            ]
        });

        let now = new Date().getTime();
        let self = this;
        setTimeout(function () {
            self.props.navigation.dispatch(resetAction);
            RNSplash.hide();
        }, Math.max(this.interval - (now - this.startTimes), 0));
    }

    render() {
        return null;
    }
}
